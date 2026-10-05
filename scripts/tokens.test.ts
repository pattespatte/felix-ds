/**
 * Paritetstest för design-token-exporten (tasks phase-2-parity-01/02).
 *
 * Jämför de committade tokens/{light,dark}.json mot färskt kompilerad CSS ur
 * samma SCSS-källor: namnmängd och varje värde måste stämma (kompilerad CSS
 * är referensen), aliasreferenser måste lösa sig, strukturen måste vara
 * giltig DTCG, och filerna får inte vara föråldrade i förhållande till
 * källorna. Kör med `bun test`.
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
    buildTokenTree,
    collectMode,
    compileMode,
    EXCLUDED,
    parseRootDeclarations,
    splitTopLevel,
    UNTYPED,
    type TokenLeaf,
} from "./tokens.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MODES = ["light", "dark"] as const;

type Mode = (typeof MODES)[number];
type JsonNode = Record<string, unknown>;

/** Plockar blad ur token-trädet; `_self`-segment stryks (rundtur till CSS-namnet). */
function flattenTokenTree(node: unknown, prefix = ""): Map<string, TokenLeaf> {
    const leaves = new Map<string, TokenLeaf>();
    if (Array.isArray(node) || typeof node !== "object" || node === null) {
        return leaves;
    }
    if ("$value" in node) {
        leaves.set(prefix, node as TokenLeaf);
    }
    for (const [key, child] of Object.entries(node as JsonNode)) {
        if (key.startsWith("$")) {
            continue;
        }
        const name = key === "_self" ? prefix : prefix === "" ? key : `${prefix}-${key}`;
        for (const [nested, leaf] of flattenTokenTree(child, name)) {
            leaves.set(nested, leaf);
        }
    }
    return leaves;
}

/** Löser {alias}-referenser i ett JSON-värde mot samma fils token-träd. */
function resolveJsonAliases(value: unknown, tree: JsonNode): unknown {
    if (typeof value === "string") {
        return value.replace(/\{([a-zA-Z0-9._]+)\}/g, (_, path: string) => {
            let node: unknown = tree;
            for (const part of path.split(".")) {
                node = (node as JsonNode)[part];
            }
            if (typeof node !== "object" || node === null || !("$value" in node)) {
                throw new Error(`alias {$${path}} kan inte lösas i token-trädet`);
            }
            return String((node as TokenLeaf).$value);
        });
    }
    if (Array.isArray(value)) {
        return value.map((v) => resolveJsonAliases(v, tree));
    }
    if (typeof value === "object" && value !== null) {
        return Object.fromEntries(
            Object.entries(value).map(([key, child]) => [key, resolveJsonAliases(child, tree)]),
        );
    }
    return value;
}

/** Löser var()-referenser i ett CSS-värde mot deklarationsmängden (med loopskydd). */
function resolveCssVars(value: string, declarations: Map<string, string>, seen = new Set<string>()): string {
    return value.replace(/var\(--([a-zA-Z0-9-]+)\)/g, (_, name: string) => {
        if (seen.has(name)) {
            throw new Error(`alias-loop vid --${name}`);
        }
        const target = declarations.get(name);
        if (target === undefined) {
            throw new Error(`okänd var()-referens --${name}`);
        }
        return resolveCssVars(target, declarations, new Set([...seen, name]));
    });
}

/** Tolkar ett CSS-skuggled till DTCG-skuggobjekt (jämförs djupt med JSON-sidan). */
function parseCssShadowPart(part: string): Record<string, string> {
    const components = splitTopLevel(part, " ").filter((component) => component.length > 0);
    const shadow: Record<string, string> = {
        offsetX: components[0],
        offsetY: components[1],
        color: components[components.length - 1],
    };
    if (components.length >= 4) {
        shadow.blur = components[2];
    }
    if (components.length >= 5) {
        shadow.spread = components[3];
    }
    return shadow;
}

/** Kontrollerar att ett tokens JSON-värde motsvarar dess CSS-värde, per typ. */
function expectTokenParity(name: string, leaf: TokenLeaf, cssValue: string, declarations: Map<string, string>, tree: JsonNode): void {
    const resolvedCss = resolveCssVars(cssValue, declarations);
    const resolvedValue = resolveJsonAliases(leaf.$value, tree);
    switch (leaf.$type) {
        case "color":
        case "dimension":
        case "duration":
        case undefined:
            // Otypade token (documenterade kortformer) jämförs som råsträng.
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

describe.each(MODES)("design-token-paritet (%s)", (mode) => {
    const declarations = parseRootDeclarations(compileMode(mode));
    const tree = JSON.parse(readFileSync(join(ROOT, "tokens", `${mode}.json`), "utf8")) as JsonNode;
    const leaves = flattenTokenTree(tree);

    test("namnmängden i JSON motsvarar det kompilerade temat", () => {
        const cssNames = new Set([...declarations.keys()].filter((name) => !EXCLUDED.includes(name)));
        const jsonNames = new Set(leaves.keys());
        const missing = [...cssNames].filter((name) => !jsonNames.has(name));
        const extra = [...jsonNames].filter((name) => !cssNames.has(name));
        expect({ missing, extra }).toEqual({ missing: [], extra: [] });
    });

    test("varje tokenvärde motsvarar det kompilerade temat", () => {
        for (const [name, leaf] of leaves) {
            const cssValue = declarations.get(name);
            if (cssValue === undefined) {
                throw new Error(`token --${name} finns i JSON men inte i kompilerad CSS`);
            }
            try {
                expectTokenParity(name, leaf, cssValue, declarations, tree);
            } catch (error) {
                throw new Error(`token --${name} avviker från kompilerad CSS: ${error instanceof Error ? error.message : error}`);
            }
        }
    });
});

describe.each(MODES)("tokenfilens struktur (%s)", (mode) => {
    const tree = JSON.parse(readFileSync(join(ROOT, "tokens", `${mode}.json`), "utf8")) as JsonNode;

    test("grupper är inte tomma och blad har $value + giltig $type", () => {
        (function walk(node: JsonNode, path: string): void {
            const isLeaf = "$value" in node;
            const children = Object.entries(node).filter(([key]) => !key.startsWith("$"));
            if (isLeaf) {
                expect(node.$value, `--${path} saknar $value`).toBeDefined();
                if (node.$type === undefined) {
                    expect(UNTYPED.includes(path), `--${path} saknar $type men är inte whitelistan`).toBe(true);
                }
            } else {
                expect(children.length > 0, `gruppen ${path} är tom`).toBe(true);
            }
            for (const [key, child] of children) {
                if (typeof child !== "object" || child === null || Array.isArray(child)) {
                    throw new Error(`--${path}-${key} är varken grupp eller blad`);
                }
                walk(child as JsonNode, path === "" ? key : `${path}-${key}`);
            }
        })(tree, "");
        expect(typeof tree.$description).toBe("string");
    });

    test("alla aliasreferenser löser sig till existerande token i samma fil", () => {
        const aliases: string[] = [];
        (function collect(node: JsonNode): void {
            if (Array.isArray(node)) {
                node.forEach(collect);
                return;
            }
            if (typeof node !== "object" || node === null) {
                return;
            }
            if (typeof node.$value === "string") {
                for (const match of node.$value.matchAll(/\{([a-zA-Z0-9._]+)\}/g)) {
                    aliases.push(match[1]);
                }
            }
            for (const child of Object.values(node)) {
                collect(child as JsonNode);
            }
        })(tree);
        expect(aliases.length).toBeGreaterThan(0);
        for (const path of aliases) {
            let node: unknown = tree;
            for (const part of path.split(".")) {
                node = (node as JsonNode)[part];
            }
            expect(typeof node, `alias {$${path}} pekar på något som inte är ett token`).toBe("object");
            expect(node !== null && "$value" in (node as JsonNode), `alias {$${path}} pekar på en grupp`).toBe(true);
        }
    });

    test("filen är identisk med vad skriptet genererar (inte föråldrad)", () => {
        const regenerated = JSON.stringify(buildTokenTree(mode as Mode), null, 2) + "\n";
        const committed = readFileSync(join(ROOT, "tokens", `${mode}.json`), "utf8");
        if (committed !== regenerated) {
            throw new Error(`tokens/${mode}.json är föråldrad – kör \`bun run tokens:build\` och committa`);
        }
    });
});

describe("känsliga klassificeringar (ljust läge)", () => {
    const tree = JSON.parse(readFileSync(join(ROOT, "tokens", "light.json"), "utf8")) as JsonNode;

    test("helskuggorna är none och fokusindikatorn är en tvådelad skugga med aliasfärger", () => {
        const focus = (tree.f as JsonNode).focus as JsonNode;
        const boxShadow = ((focus.box as JsonNode).shadow as JsonNode) as unknown as TokenLeaf;
        expect(boxShadow.$type).toBe("shadow");
        expect(boxShadow.$value).toEqual([
            { offsetX: "0", offsetY: "0", blur: "0", spread: "2px", color: "{fkds.focus.indicator.color.background}" },
            { offsetX: "0", offsetY: "0", blur: "0", spread: "4px", color: "{fkds.focus.indicator.color._self}" },
        ]);
        const button = (tree.f as JsonNode).button as JsonNode;
        expect((((button.shadow as JsonNode)._self as JsonNode) as unknown as TokenLeaf).$value).toBe("none");
    });

    test("sidopanelens tertiärbakgrund är en aliasreferens som löser sig", () => {
        const pageLayout = collectMode("light").get("f-page-layout-background");
        expect(pageLayout?.$value).toBe("{fkds.color.background.tertiary}");
        expect(pageLayout?.$type).toBe("color");
    });

    test("”none” på icke-skuggor är otypade, inte skuggor", () => {
        const leaves = collectMode("light");
        for (const name of ["f-button-discrete-radius-hover", "f-modal-close-button-padding"]) {
            const leaf = leaves.get(name);
            expect(leaf?.$type, `--${name} ska sakna $type`).toBeUndefined();
            expect(leaf?.$value).toBe("none");
        }
        expect(leaves.get("f-button-shadow")?.$type).toBe("shadow");
    });

    test("trädet är strikt – inga blandnoder – och `_self`-token finns som riktiga blad", () => {
        (function walk(node: unknown, path: string): void {
            if (Array.isArray(node) || typeof node !== "object" || node === null) {
                return;
            }
            const children = Object.entries(node as JsonNode).filter(([key]) => !key.startsWith("$"));
            if ("$value" in node) {
                expect(children.length, `blandnod vid ${path}`).toBe(0);
            } else {
                expect(children.length > 0, `tom grupp vid ${path}`).toBe(true);
            }
            for (const [key, child] of children) {
                walk(child, `${path}.${key}`);
            }
        })(tree, "$");
        const f = tree.f as JsonNode;
        expect(((f.font as JsonNode).family as JsonNode)._self).toMatchObject({ $type: "fontFamily" });
        expect(((f.button as JsonNode).shadow as JsonNode)._self).toMatchObject({ $value: "none" });
        const fkds = tree.fkds as JsonNode;
        const focus = ((fkds.focus as JsonNode).indicator as JsonNode).color as JsonNode;
        expect(focus._self).toMatchObject({ $value: "#000000" });
        expect(focus.background).toMatchObject({ $value: "#ffffff" });
    });
});
