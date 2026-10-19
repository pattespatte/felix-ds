/**
 * Importerar W3C Design Tokens (DTCG-utkastformat) och genererar SCSS-
 * anpassade egenskaper – importriktningen som speglar exporten i tokens.ts.
 *
 * Användning:
 *   bun run tokens:import -- <fil.json> [--out <sökväg>]
 *
 * Konventioner som skriptet följer:
 * - handskrivna SCSS-källor är fortfarande den enda sanningskällan; importen
 *   skriver aldrig över src/theme och är skrivskyddad mot sin indatafil –
 *   riktningen finns för rundtursbeviset och för överlämning från
 *   designverktyg som talar DTCG
 * - valideringen är strikt och varje fel namnger tokensökvägen: blandnoder,
 *   blad utan $value, $type utanför den stödda whitelistan, olösta och
 *   cykliska alias, krockande css-namn
 * - alias skrivs som var(--mål-namn) så att den genererade filen refererar
 *   i stället för att duplicera
 * - utdata är deterministiskt: ett :root-block, deklarerade namn sorterade,
 *   2 mellanslag, avslutande radbrytning
 */

import { readFileSync, writeFileSync } from "node:fs";
import { splitTopLevel, type TokenLeaf } from "./tokens.ts";

/** De DTCG-typer felix-modellen kan uttrycka; allt annat är ett hårt fel. */
export const SUPPORTED_TYPES: readonly string[] = [
    "color",
    "dimension",
    "number",
    "duration",
    "fontFamily",
    "shadow",
];

/** De metanycklar en DTCG-nod får bära utöver gruppmedlemmarna. */
const RESERVED_KEYS: ReadonlySet<string> = new Set(["$value", "$type", "$description", "$extensions"]);

const ALIAS_PATTERN = /\{([a-zA-Z0-9._]+)\}/g;
const HEX_PATTERN = /^#[0-9a-fA-F]{3,8}$/;
const COLOR_FUNCTION_PATTERN = /^(rgba?|hsla?)\(/;
const DIMENSION_PATTERN = /^0$|^-?(\d+\.?\d*|\.\d+)[a-zA-Z%]+$/;
const SHADOW_LENGTH_PATTERN = /^-?(\d+\.?\d*|\.\d+)(px|rem|em)?$/;
const UNQUOTED_FONT_NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9-]*$/;
const CSS_NAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-]*$/;

export type JsonNode = Record<string, unknown>;

function fail(message: string): never {
    throw new Error(message);
}

// ---------------------------------------------------------------------------
// Delade hjälpare (lyfta ur tokens.test.ts så export och import använder en
// enda implementation av namn-bijektionen och aliaslösningen).
// ---------------------------------------------------------------------------

/** Plockar blad ur token-trädet; `_self`-segment stryks (rundtur till CSS-namnet). */
export function flattenTokenTree(node: unknown, prefix = ""): Map<string, TokenLeaf> {
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
export function resolveJsonAliases(value: unknown, tree: JsonNode): unknown {
    if (typeof value === "string") {
        return value.replace(ALIAS_PATTERN, (_, path: string) => {
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
export function resolveCssVars(value: string, declarations: Map<string, string>, seen = new Set<string>()): string {
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

/** Tolkar ett CSS-skuggled till DTCG-skuggobjekt. */
export function parseCssShadowPart(part: string): Record<string, string> {
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

// ---------------------------------------------------------------------------
// Namn-bijektion: DTCG-punktssökväg ↔ css-namn.
// ---------------------------------------------------------------------------

/**
 * Mekanisk invers av exportens namnregel: punktsökvägen fogas samman med
 * bindestreck och `_self`-segment stryks (`f.font.family._self` →
 * `f-font-family`). Två sökvägar som ger samma namn är ett hårt fel.
 */
export function pathToCssName(path: string): string {
    const name = path
        .split(".")
        .filter((segment) => segment !== "_self")
        .join("-");
    if (!CSS_NAME_PATTERN.test(name)) {
        return fail(`sökvägen "${path}" ger inte något giltigt css-namn ("--${name}")`);
    }
    return name;
}

// ---------------------------------------------------------------------------
// Validering.
// ---------------------------------------------------------------------------

interface LeafPath {
    path: string;
    leaf: JsonNode;
}

/** Samlar alla bladsökvägar (med `_self`-segment bevarade, som aliasen skrivs). */
function collectLeaves(node: unknown, segments: string[], into: LeafPath[]): void {
    if (typeof node !== "object" || node === null || Array.isArray(node)) {
        return;
    }
    if ("$value" in node) {
        into.push({ path: segments.join("."), leaf: node as JsonNode });
        return;
    }
    for (const [key, child] of Object.entries(node as JsonNode)) {
        if (!key.startsWith("$")) {
            collectLeaves(child, [...segments, key], into);
        }
    }
}

function isColorValue(value: unknown): boolean {
    return typeof value === "string" && (HEX_PATTERN.test(value) || COLOR_FUNCTION_PATTERN.test(value));
}

function isDimensionValue(value: unknown): boolean {
    return typeof value === "string" && DIMENSION_PATTERN.test(value);
}

function validateShadowObject(shadow: unknown, path: string): void {
    if (typeof shadow !== "object" || shadow === null || Array.isArray(shadow)) {
        fail(`väntar ett skuggobjekt på ${path}`);
    }
    const allowed = new Set(["offsetX", "offsetY", "blur", "spread", "color"]);
    for (const key of Object.keys(shadow as JsonNode)) {
        if (!allowed.has(key)) {
            fail(`okänd skuggkomponent "${key}" på ${path} – tillåtna: offsetX, offsetY, blur, spread, color`);
        }
    }
    for (const key of ["offsetX", "offsetY", "color"]) {
        if (!(key in (shadow as JsonNode))) {
            fail(`skuggan på ${path} saknar "${key}"`);
        }
    }
    for (const key of ["offsetX", "offsetY", "blur", "spread"]) {
        const value = (shadow as Record<string, unknown>)[key];
        if (value === undefined) {
            continue;
        }
        if (typeof value !== "string" || !SHADOW_LENGTH_PATTERN.test(value)) {
            fail(`skuggkomponenten "${key}" på ${path} är ingen längd ("${String(value)}")`);
        }
    }
    if (!isColorValue((shadow as Record<string, unknown>).color)) {
        fail(`skuggans färg på ${path} är ingen färg ("${String((shadow as Record<string, unknown>).color)}")`);
    }
}

/** Kontrollerar att ett löst värde har formen som dess $type lovar. */
function validateValueShape(type: string | undefined, resolved: unknown, path: string): void {
    switch (type) {
        case "color":
            if (!isColorValue(resolved)) {
                fail(`${path} är typad color men värdet "${String(resolved)}" är ingen färg`);
            }
            return;
        case "dimension":
            if (!isDimensionValue(resolved)) {
                fail(`${path} är typad dimension men värdet "${String(resolved)}" saknar enhet`);
            }
            return;
        case "duration":
            if (typeof resolved !== "string" || !/^0$|^-?(\d+\.?\d*|\.\d+)(ms|s)$/.test(resolved)) {
                fail(`${path} är typad duration men värdet "${String(resolved)}" är ingen tid (s/ms)`);
            }
            return;
        case "number":
            if (typeof resolved === "number" ? !Number.isFinite(resolved) : !/^-?(\d+\.?\d*|\.\d+)$/.test(String(resolved))) {
                fail(`${path} är typad number men värdet "${String(resolved)}" är inget tal`);
            }
            return;
        case "fontFamily":
            if (!Array.isArray(resolved) || resolved.some((name) => typeof name !== "string" || name.length === 0)) {
                fail(`${path} är typad fontFamily men värdet är ingen lista med typsnittsnamn`);
            }
            return;
        case "shadow":
            if (resolved === "none") {
                return;
            }
            if (Array.isArray(resolved)) {
                if (resolved.length === 0) {
                    fail(`${path} har en tom skugglista`);
                }
                for (const part of resolved) {
                    validateShadowObject(part, path);
                }
                return;
            }
            validateShadowObject(resolved, path);
            return;
        case undefined:
            // Otypade token (kortformer, css-nyckelord) kontrolleras bara på att
            // värdet är en sträng efter aliaslösning.
            if (typeof resolved !== "string") {
                fail(`${path} saknar $type men värdet är ingen sträng`);
            }
            return;
        default:
            fail(`${path} har $type "${type}" som inte stöds – tillåtna: ${SUPPORTED_TYPES.join(", ")}`);
    }
}

/**
 * Validerar ett DTCG-träd strikt och kastar med tokensökvägen i meddelandet:
 * struktur (grupper/blad, inga blandnoder), metanycklar, $type-whitelistan,
 * alias som löser sig utan cykler och värdeformer per typ.
 */
export function validateDtcgTree(tree: unknown): void {
    if (typeof tree !== "object" || tree === null || Array.isArray(tree)) {
        fail("tokenfilen måste vara ett JSON-objekt");
    }

    (function walkStructure(node: JsonNode, path: string): void {
        for (const key of Object.keys(node)) {
            if (key.startsWith("$") && !RESERVED_KEYS.has(key)) {
                fail(`okänd metanyckel "${key}" på ${path} – tillåtna: ${[...RESERVED_KEYS].join(", ")}`);
            }
        }
        if ("$type" in node && !("$value" in node)) {
            fail(`$type på gruppen ${path} – $type hör hemma på token`);
        }
        const children = Object.entries(node).filter(([key]) => !key.startsWith("$"));
        if ("$value" in node) {
            if (children.length > 0) {
                fail(`blandnod på ${path} – ett token får inte ha underordnade grupper`);
            }
            return;
        }
        if (children.length === 0) {
            fail(`gruppen ${path} är tom`);
        }
        for (const [key, child] of children) {
            if (typeof child !== "object" || child === null || Array.isArray(child)) {
                fail(`${path === "" ? key : `${path}.${key}`} är varken grupp eller token`);
            }
            walkStructure(child as JsonNode, path === "" ? key : `${path}.${key}`);
        }
    })(tree as JsonNode, "");

    const leaves: LeafPath[] = [];
    collectLeaves(tree, [], leaves);
    if (leaves.length === 0) {
        fail("tokenfilen innehåller inga token");
    }

    // Alias: varje {referens} måste lösa sig till ett token i samma fil, och
    // helvärdesalias får inte bilda en cykel.
    const leafByPath = new Map(leaves.map((entry) => [entry.path, entry.leaf]));
    for (const { path, leaf } of leaves) {
        const references = JSON.stringify(leaf.$value).match(ALIAS_PATTERN) ?? [];
        for (const reference of references) {
            const targetPath = reference.slice(1, -1);
            if (!leafByPath.has(targetPath)) {
                fail(`alias {${targetPath}} på ${path} pekar på något som inte är ett token i samma fil`);
            }
        }
        if (typeof leaf.$value === "string" && leaf.$value.replace(ALIAS_PATTERN, "").trim() === "" && leaf.$value.trim() !== "") {
            // Helvärdesalias: följ kedjan och upptäck cykler.
            const seen = new Set<string>([path]);
            let cursor = leaf.$value;
            while (true) {
                const targetPath = cursor.replace(ALIAS_PATTERN, "$1");
                if (seen.has(targetPath)) {
                    fail(`alias-cykel: ${path} → ${targetPath}`);
                }
                seen.add(targetPath);
                const target = leafByPath.get(targetPath);
                if (target === undefined) {
                    fail(`alias {${targetPath}} på ${path} pekar på något som inte är ett token i samma fil`);
                }
                const targetValue = target.$value;
                if (typeof targetValue === "string" && targetValue.replace(ALIAS_PATTERN, "").trim() === "" && targetValue.trim() !== "") {
                    cursor = targetValue;
                    continue;
                }
                break;
            }
        }
    }

    // Värdeformer: kontrollera den fullt lösta värden mot bladets $type.
    for (const { path, leaf } of leaves) {
        const resolved = resolveJsonAliases(leaf.$value, tree as JsonNode);
        validateValueShape(leaf.$type as string | undefined, resolved, path);
    }

    // Namnkrockar: två olika sökvägar som ger samma css-namn är ett hårt fel.
    const nameByPath = new Map<string, string>();
    for (const { path } of leaves) {
        const name = pathToCssName(path);
        const collision = nameByPath.get(name);
        if (collision !== undefined) {
            fail(`sökvägarna "${collision}" och "${path}" ger samma css-namn --${name}`);
        }
        nameByPath.set(name, path);
    }
}

// ---------------------------------------------------------------------------
// Utmatning.
// ---------------------------------------------------------------------------

/**
 * Citerar ett typsnittsnamn när det inte är en okvensad css-identifierare.
 * Exporten strök citattecken ur typsnittsnamn, så originalets citering kan
 * inte återvinnas ur JSON – rundturstestet jämför därför fontlistor kanoniskt
 * genom att köra båda sidorna genom den här regeln.
 */
export function quoteFontName(name: string): string {
    return UNQUOTED_FONT_NAME_PATTERN.test(name) ? name : `"${name}"`;
}

function replaceAliases(value: string): string {
    return value.replace(ALIAS_PATTERN, (_, path: string) => `var(--${pathToCssName(path)})`);
}

function shadowToCss(shadow: unknown): string {
    const part = shadow as Record<string, unknown>;
    const lengths = ["offsetX", "offsetY", "blur", "spread"]
        .map((key) => part[key])
        .filter((length) => length !== undefined)
        .map(String);
    return [...lengths, replaceAliases(String(part.color))].join(" ");
}

function leafToCssValue(leaf: JsonNode): string {
    const value = leaf.$value;
    if (typeof value === "string") {
        return replaceAliases(value);
    }
    if (typeof value === "number") {
        return String(value);
    }
    if (leaf.$type === "fontFamily" && Array.isArray(value)) {
        return value.map((name) => quoteFontName(String(name))).join(", ");
    }
    if (leaf.$type === "shadow") {
        const shadows = Array.isArray(value) ? value : [value];
        return shadows.map(shadowToCss).join(", ");
    }
    return fail(`värdet på bladet kan inte skrivas som css-deklaration (${JSON.stringify(value)})`);
}

/**
 * Validerar ett DTCG-träd och genererar deterministiska anpassade egenskaper:
 * ett :root-block, deklarerade namn sorterade, alias som var()-referenser.
 */
export function importDtcg(tree: unknown): string {
    validateDtcgTree(tree);
    const leaves = flattenTokenTree(tree);
    const declarations = [...leaves.entries()]
        .map(([name, leaf]) => ({ name, value: leafToCssValue(leaf as unknown as JsonNode) }))
        .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    const body = declarations.map((declaration) => `  --${declaration.name}: ${declaration.value};`).join("\n");
    return `:root {\n${body}\n}\n`;
}

function failCli(message: string): never {
    console.error(`Fel: ${message}`);
    process.exit(1);
}

if (import.meta.main) {
    const argv = process.argv.slice(2);
    const outIndex = argv.indexOf("--out");
    let outPath: string | undefined;
    if (outIndex !== -1) {
        outPath = argv[outIndex + 1];
        if (outPath === undefined) {
            failCli("--out kräver en sökväg");
        }
        argv.splice(outIndex, 2);
    }
    const [file] = argv;
    if (file === undefined || file.startsWith("--")) {
        failCli("användning: bun scripts/tokens-import.ts <fil.json> [--out <sökväg>]");
    }
    let tree: unknown;
    try {
        tree = JSON.parse(readFileSync(file, "utf8"));
    } catch (error) {
        failCli(`kan inte läsa ${file}: ${error instanceof Error ? error.message : error}`);
    }
    const css = importDtcg(tree);
    if (outPath === undefined) {
        process.stdout.write(css);
    } else {
        writeFileSync(outPath, css);
        console.log(`skrev ${outPath}`);
    }
}
