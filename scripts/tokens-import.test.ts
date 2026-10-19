/**
 * Rundturs- och valideringstest för DTCG-importen.
 *
 * Importen av de committade tokens/{light,dark}.json måste kompilera till
 * exakt samma :root-deklarationer som det sammansatta temat – importen är den
 * mekaniska inversen av exporten – och varje genererat värde måste stämma mot
 * JSON-sidan efter aliaslösning. En främmande DTCG-fil (designverktygsexport)
 * ska importeras rent, och ogiltiga filer ska fällas med tokensökvägen i
 * meddelandet. Kör med `bun test`.
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { compileString } from "sass";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compileMode, EXCLUDED, parseRootDeclarations, splitTopLevel, type TokenLeaf } from "./tokens.ts";
import {
    flattenTokenTree,
    importDtcg,
    parseCssShadowPart,
    quoteFontName,
    resolveCssVars,
    resolveJsonAliases,
} from "./tokens-import.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MODES = ["light", "dark"] as const;

type Mode = (typeof MODES)[number];
type JsonNode = Record<string, unknown>;

/** Sorterade deklarationer som postpar, för deterministisk jämförelse. */
function sortedEntries(declarations: Map<string, string>): [string, string][] {
    return [...declarations.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
}

/**
 * Kanoniserar fontlistor på båda sidor före jämförelsen: exporten strök
 * citattecken ur typsnittsnamn (”Consolas” → Consolas), så originalets
 * citering går inte att återvinna ur JSON – allt annat jämförs byteexakt.
 */
function canonicalizeDeclarations(declarations: Map<string, string>, leaves: Map<string, TokenLeaf>): Map<string, string> {
    const canonical = new Map<string, string>();
    for (const [name, value] of declarations) {
        if (leaves.get(name)?.$type === "fontFamily") {
            canonical.set(
                name,
                splitTopLevel(value, ",")
                    .map((part) => quoteFontName(part.trim().replace(/^"|"$/g, "")))
                    .join(", "),
            );
        } else {
            canonical.set(name, value);
        }
    }
    return canonical;
}

/** Jämför ett löst css-värde mot bladets JSON-värde, per typ. */
function expectImportParity(
    name: string,
    leaf: TokenLeaf,
    cssValue: string,
    declarations: Map<string, string>,
    tree: JsonNode,
): void {
    const resolvedCss = resolveCssVars(cssValue, declarations);
    const resolvedValue = resolveJsonAliases(leaf.$value, tree);
    switch (leaf.$type) {
        case "color":
        case "dimension":
        case "duration":
        case undefined:
            expect(resolvedValue).toBe(resolvedCss);
            break;
        case "number":
            expect(resolvedValue).toBe(Number(resolvedCss));
            break;
        case "fontFamily":
            expect(resolvedValue).toEqual(splitTopLevel(resolvedCss, ",").map((part) => part.trim().replace(/^"|"$/g, "")));
            break;
        case "shadow":
            if (resolvedValue === "none") {
                expect(resolvedCss).toBe("none");
                break;
            }
            expect(resolvedValue).toEqual(splitTopLevel(resolvedCss, ",").map(parseCssShadowPart));
            break;
        default:
            throw new Error(`okänd $type "${leaf.$type}" på --${name}`);
    }
}

describe.each(MODES)("dtcg-import-rundtur (%s)", (mode) => {
    const tree = JSON.parse(readFileSync(join(ROOT, "tokens", `${mode}.json`), "utf8")) as JsonNode;
    const leaves = flattenTokenTree(tree);
    const generated = parseRootDeclarations(compileString(importDtcg(tree)).css);
    const theme = parseRootDeclarations(compileMode(mode));
    const themeFiltered = new Map([...theme].filter(([name]) => !EXCLUDED.includes(name)));

    test("den genererade filen kompilerar till temats deklarationer", () => {
        expect(sortedEntries(canonicalizeDeclarations(generated, leaves))).toEqual(
            sortedEntries(canonicalizeDeclarations(themeFiltered, leaves)),
        );
    });

    test("varje genererat värde motsvarar JSON-värdet efter aliaslösning", () => {
        expect(new Set(generated.keys())).toEqual(new Set(leaves.keys()));
        for (const [name, leaf] of leaves) {
            const cssValue = generated.get(name);
            if (cssValue === undefined) {
                throw new Error(`token --${name} finns i JSON men inte i den genererade filen`);
            }
            try {
                expectImportParity(name, leaf, cssValue, generated, tree);
            } catch (error) {
                throw new Error(`token --${name} avviker från JSON-värdet: ${error instanceof Error ? error.message : error}`);
            }
        }
    });
});

describe("främmande dtcg-filer", () => {
    const foreignTree = {
        $description: "Export från ett designverktyg",
        color: {
            primary: { $type: "color", $value: "#005fcc", $description: "Primär actionsfärg" },
            "secondary-surface": { $type: "color", $value: "{color.primary}" },
        },
        space: {
            medium: { $type: "dimension", $value: "12px" },
            large: { $type: "dimension", $value: "24px" },
        },
    };

    test("importeras rent och ger väntade, sorterade deklarationer med alias som var()-referens", () => {
        expect(importDtcg(foreignTree)).toBe(
            [
                ":root {",
                "  --color-primary: #005fcc;",
                "  --color-secondary-surface: var(--color-primary);",
                "  --space-large: 24px;",
                "  --space-medium: 12px;",
                "}",
                "",
            ].join("\n"),
        );
    });
});

describe("ogiltiga dtcg-filer fälls med sökvägen i meddelandet", () => {
    test("token utan $value", () => {
        expect(() => importDtcg({ a: { $type: "color" } })).toThrow("$type på gruppen a");
    });

    test("$type utanför den stödda whitelistan", () => {
        expect(() => importDtcg({ a: { $type: "gradient", $value: "linear-gradient(red, blue)" } })).toThrow(
            `a har $type "gradient" som inte stöds`,
        );
    });

    test("alias till en sökväg som inte finns", () => {
        expect(() => importDtcg({ a: { $value: "{no.such.token}" } })).toThrow("alias {no.such.token} på a");
    });

    test("cykliska alias", () => {
        expect(() => importDtcg({ a: { $value: "{b}" }, b: { $value: "{a}" } })).toThrow("alias-cykel");
    });

    test("blandnod – token med underordnade", () => {
        expect(() => importDtcg({ a: { $value: "#000000", b: { $value: "#ffffff" } } })).toThrow("blandnod på a");
    });

    test("krockande css-namn från olika sökvägar", () => {
        const tree = {
            group: { a: { b: { $type: "color", $value: "#000000" } } },
            "group-a": { b: { $type: "color", $value: "#ffffff" } },
        };
        expect(() => importDtcg(tree)).toThrow(`sökvägarna "group.a.b" och "group-a.b" ger samma css-namn --group-a-b`);
    });
});
