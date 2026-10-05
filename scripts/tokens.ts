/**
 * Extraherar design-token ur det sammansatta temat (upstream
 * @fkui/theme-default plus felix-profilens overrides) i både ljust och mörkt
 * läge och skriver dem som W3C Design Tokens (DTCG-utkastformat) till
 * tokens/light.json och tokens/dark.json.
 *
 * Användning:
 *   bun run tokens:build        generera tokens/light.json och tokens/dark.json
 *
 * Konventioner som skriptet följer:
 * - SCSS-källorna är den enda sanningskällan; exporten är enkelriktad
 * - tokenmängden upptäcks genom kompilering, aldrig ur en hårdkodad namnlista
 * - utdata är deterministiskt: sorterade nycklar, 2 mellanslag, LF, avslutande
 *   radbrytning
 * - värden som inte kan typas får aldrig tyst hoppas över – skriptet felar
 */

import { compileString } from "sass";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

type Mode = "light" | "dark";

/** Tokennamn som medvetet lämnas ur exporten (se PRD och docs/tokens.*.md). */
export const EXCLUDED: readonly string[] = [
    // url()-data-URI:er har ingen naturlig DTCG-typ; logotyperna når
    // konsumenterna via CSS-variablerna som vanligt.
    "f-logo-image-small",
    "f-logo-image-large",
    // Paketmetadata från upstream, ingen designtoken; värdet ändras vid varje
    // upstream-lyft och skulle bara skapa brus i diffarna.
    "fkui-theme-default-version",
];

/**
 * Token utan naturlig DTCG-typ som ändå behålls (utan `$type`) med sitt
 * råa CSS-värde: CSS-nyckelord (inherit/initial/ease-out), flerdelade
 * kortformer (marginaler, storlekar) och transition-kortformer. Allt annat
 * som inte kan typas kastar – tyst bortfall är förbjudet.
 */
export const UNTYPED: readonly string[] = [
    "f-text-color-heading-1",
    "f-text-color-heading-2",
    "f-text-color-heading-3",
    "f-text-color-heading-4",
    "f-text-color-heading-5",
    "f-text-color-heading-6",
    "f-button-animation-curve",
    "f-button-discrete-padding-top",
    "f-button-discrete-padding-right",
    "f-button-discrete-padding-bottom",
    "f-button-discrete-padding-left",
    "f-button-discrete-black-padding-top",
    "f-button-discrete-black-padding-right",
    "f-button-discrete-black-padding-bottom",
    "f-button-discrete-black-padding-left",
    "padding-input-fields",
    "f-button-tertiary-table-column-action-icon-margin",
    "f-button-tertiary-table-column-action-margin",
    "f-modal-close-button-margin",
    "f-tooltip-close-button-margin",
    "f-loader-margin",
    "f-logo-size-large",
    "f-animation-expand-open",
    "f-animation-expand-close",
];

/**
 * `$description` bara för de token som en kommentar i felix-SCSS:en
 * dokumenterar enskilt (PRD-beslut); lägena har olika kommentarer, så
 * kartan är per färgläge. Inga massgenererade beskrivningar för upstream.
 */
const DESCRIPTIONS: Record<Mode, Record<string, string>> = {
    light: {
        "f-page-layout-background":
            "Paneler läser profilens tertiära bakgrund; uppström definierar token bara inuti page-layoutens egna shadow parts.",
        "fkds-color-header-text-primary":
            "Headern har ljus bakgrund i profilen, så headertext använder primär textfärg i stället för uppströms inverterade färg.",
        "fkds-focus-indicator-color":
            "Yttre fokusringens färg – svart, enligt profilens tvåringsindikator (se f.focus.box.shadow).",
        "fkds-focus-indicator-color-background":
            "Inre fokusringens färg – vit, enligt profilens tvåringsindikator (se f.focus.box.shadow).",
    },
    dark: {
        "f-page-layout-background":
            "Paneler läser profilens tertiära bakgrund; samma bindning som i ljust läge.",
        "fkds-color-header-text-primary":
            "Headern har mörk bakgrund i profilen, så headertext använder primär textfärg (vit).",
        "fkds-color-feedback-text-on-warning":
            "Använder varningens mörka på-ljus-yta-värde även i mörkt läge – inte det nästan vita varningstextsvärdet.",
    },
};

/** Ett DTCG-tokenblad: `$value` + valfri `$type`/`$description`. */
export interface TokenLeaf {
    $description?: string;
    $type?: string;
    $value: unknown;
}

/** Kompilar det sammansatta temat för ett färgläge till CSS. */
export function compileMode(mode: Mode): string {
    return compileString(
        `@use "src/theme/default" as felix with ($global: false);\n\n:root {\n    @include felix.${mode};\n}\n`,
        {
            loadPaths: [join(ROOT, "node_modules"), ROOT],
        },
    ).css;
}

/**
 * Plockar alla deklarerade anpassade egenskaper ur alla exakta :root-block i
 * kompilerad CSS. Det sammansatta temat delar upp variablerna i flera
 * :root-block (sass återöppnar blocket efter kapslade regler), och senare
 * deklarationer vinner – samma kaskadregler som i webbläsaren – vilket ger
 * det sammansatta temats slutgiltiga värden. Regler som bara börjar med
 * :root (t.ex. ”:root h1”) är komponentregler, inte token-deklarationer.
 */
export function parseRootDeclarations(css: string): Map<string, string> {
    const declarations = new Map<string, string>();
    for (const block of topLevelBlocks(css)) {
        if (block.selector !== ":root") {
            continue;
        }
        const pattern = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(block.body)) !== null) {
            declarations.set(match[1], joinWrappedValue(match[2]));
        }
    }
    return declarations;
}

/** Radbryter sass-output långa värden; slå ihop radbrytning + indrag till ett mellanslag. */
function joinWrappedValue(value: string): string {
    return value.replace(/\s*\n\s*/g, " ").trim();
}

/** Stegar igenom CSS:ns toppnivåblock som (selektor, innehåll). */
function* topLevelBlocks(css: string): Generator<{ selector: string; body: string }> {
    let i = 0;
    while (i < css.length) {
        const open = css.indexOf("{", i);
        if (open === -1) {
            return;
        }
        const selector = css.slice(i, open).trim();
        let depth = 1;
        let j = open + 1;
        while (j < css.length && depth > 0) {
            if (css[j] === "{") {
                depth++;
            } else if (css[j] === "}") {
                depth--;
            }
            j++;
        }
        yield { selector, body: css.slice(open + 1, j - 1) };
        i = j;
    }
}

function fail(message: string): never {
    console.error(`Fel: ${message}`);
    process.exit(1);
}

// ---------------------------------------------------------------------------
// Klassificering: CSS-värde → DTCG-typ och $value (task phase-1-extract-02).
// ---------------------------------------------------------------------------

/** Delar ett värde på toppnivåkommatecken (parenteser i rgb()/var() respekteras). */
function splitTopLevel(value: string, separator: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = "";
    for (const char of value) {
        if (char === "(") depth++;
        if (char === ")") depth--;
        if (char === separator && depth === 0) {
            parts.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }
    if (current.trim().length > 0) {
        parts.push(current.trim());
    }
    return parts;
}

const HEX_PATTERN = /^#[0-9a-fA-F]{3,8}$/;
const COLOR_FUNCTION_PATTERN = /^(rgba?|hsla?)\(/;
const LENGTH_PATTERN = /^-?\d+(\.\d+)?(px|rem|em|%|lh)$/;
const DURATION_PATTERN = /^-?\d+(\.\d+)?(ms|s)$/;
const NUMBER_PATTERN = /^-?\d+(\.\d+)?$/;
const WHOLE_ALIAS_PATTERN = /^var\(--([a-zA-Z0-9-]+)\)$/;
const FONT_NAME_PATTERN = /^("[^"]+"|[a-zA-Z][a-zA-Z0-9 -]*)$/;

function isColor(value: string): boolean {
    return HEX_PATTERN.test(value) || COLOR_FUNCTION_PATTERN.test(value);
}

/**
 * Tolkar ett skuggvärde (ett toppnivåkomma-delat led) till DTCG-skuggobjekt.
 * Färger behålls som aliasreferens när de är var()-referenser. Returnerar
 * null om ledet inte är en skugga (t.ex. en fyrdelad marginal utan färg).
 */
function parseShadowPart(part: string): Record<string, string> | null {
    const components = splitTopLevel(part, " ");
    if (components.length < 3) {
        return null;
    }
    const color = components[components.length - 1];
    if (!isColor(color) && !WHOLE_ALIAS_PATTERN.test(color)) {
        return null;
    }
    const lengths = components.slice(0, -1);
    if (lengths.length < 2 || lengths.length > 4 || !lengths.every((l) => /^-?\d+(\.\d+)?(px|rem|em)?$/.test(l))) {
        return null;
    }
    const shadow: Record<string, string> = {
        offsetX: lengths[0],
        offsetY: lengths[1],
        color: toAlias(color),
    };
    if (lengths.length >= 3) {
        shadow.blur = lengths[2];
    }
    if (lengths.length >= 4) {
        shadow.spread = lengths[3];
    }
    return shadow;
}

/** var(--x) → DTCG-alias {$x.med.punkter}; annat värde oförändrat. */
function toAlias(color: string): string {
    const match = color.match(WHOLE_ALIAS_PATTERN);
    if (match === null) {
        return color;
    }
    return `{$${match[1].split("-").join(".")}}`;
}

/** Klassificerar ett CSS-värde till DTCG-blad; kastar på otypbara former. */
export function classify(name: string, value: string): TokenLeaf {
    if (WHOLE_ALIAS_PATTERN.test(value)) {
        // $type sätts i efterhand ur måltoken (se collectMode).
        return { $value: toAlias(value) };
    }
    if (isColor(value)) {
        return { $type: "color", $value: value };
    }
    if (LENGTH_PATTERN.test(value)) {
        return { $type: "dimension", $value: value };
    }
    if (DURATION_PATTERN.test(value)) {
        return { $type: "duration", $value: value };
    }
    if (NUMBER_PATTERN.test(value)) {
        return { $type: "number", $value: Number(value) };
    }
    const fontParts = splitTopLevel(value, ",");
    if (fontParts.length >= 2 && fontParts.every((p) => FONT_NAME_PATTERN.test(p))) {
        return {
            $type: "fontFamily",
            $value: fontParts.map((p) => p.replace(/^"|"$/g, "")),
        };
    }
    if (value === "none") {
        // Dokumenterad avvikelse: profilen är helt platt (inga skuggor), och
        // att ta bort token skulle dölja det designbeslutet (PRD).
        return { $type: "shadow", $value: "none" };
    }
    const shadowParts = splitTopLevel(value, ",");
    const shadows = shadowParts.map(parseShadowPart);
    if (shadows.length > 0 && shadows.every((s) => s !== null)) {
        return {
            $type: "shadow",
            $value: shadows.length === 1 ? shadows[0] : shadows,
        };
    }
    if (UNTYPED.includes(name)) {
        return { $value: value };
    }
    fail(`kan inte typa token --${name} med värde "${value}" – lägg till en mappningsregel eller dokumentera ett undantag`);
}

/**
 * Samlar och klassificerar alla token för ett läge. Helvärdesalias får sin
 * $type av måltoken (och kastar om målet saknas eller inte är typat).
 */
export function collectMode(mode: Mode): Map<string, TokenLeaf> {
    const declarations = parseRootDeclarations(compileMode(mode));
    const leaves = new Map<string, TokenLeaf>();
    for (const [name, value] of declarations) {
        if (EXCLUDED.includes(name)) {
            continue;
        }
        leaves.set(name, classify(name, value));
    }
    for (const [name, leaf] of leaves) {
        if (typeof leaf.$value !== "string" || !leaf.$value.startsWith("{$")) {
            continue;
        }
        const targetName = leaf.$value.slice(2, -1).split(".").join("-");
        const target = leaves.get(targetName);
        if (target === undefined || target.$type === undefined) {
            fail(`alias --${name} pekar på okänd eller otypad token --${targetName}`);
        }
        leaf.$type = target.$type;
        const description = DESCRIPTIONS[mode][name];
        if (description !== undefined) {
            leaf.$description = description;
        }
    }
    for (const [name, description] of Object.entries(DESCRIPTIONS[mode])) {
        const leaf = leaves.get(name);
        if (leaf === undefined) {
            fail(`beskriven token --${name} finns inte i ${mode}-läget`);
        }
        leaf.$description = description;
    }
    return leaves;
}

// ---------------------------------------------------------------------------
// Utmatning: nästla token under toppnivågrupper och skriv deterministisk JSON
// (task phase-1-extract-03).
// ---------------------------------------------------------------------------

type TokenNode = TokenLeaf | { [key: string]: TokenNode };

const FILE_DESCRIPTIONS: Record<Mode, string> = {
    light: "Genererad av scripts/tokens.ts – redigera inte för hand. Det sammansatta temats fullständiga tokenmängd i ljust läge (uppströms @fkui/theme-default plus felix-profilens överskrivningar) som W3C Design Tokens (DTCG-utkast). Generera om med `bun run tokens:build`; paritetstesten i scripts/tokens.test.ts fäller föråldrade filer.",
    dark: "Genererad av scripts/tokens.ts – redigera inte för hand. Det sammansatta temats fullständiga tokenmängd i mörkt läge (uppströms @fkui/theme-default plus felix-profilens överskrivningar) som W3C Design Tokens (DTCG-utkast). Generera om med `bun run tokens:build`; paritetstesten i scripts/tokens.test.ts fäller föråldrade filer.",
};

/**
 * Nästlar token via avstavning: --f-font-size-h1 → f.font.size.h1. En nod kan
 * vara både token och grupp (t.ex. fkds.color.feedback.background.warning med
 * undergruppen strong) – bladets $-egenskaper slås samman med gruppen, vilket
 * bevarar den mekaniska rundturen namn ↔ sökväg.
 */
export function buildTokenTree(mode: Mode): Record<string, TokenNode> {
    const root: Record<string, TokenNode> = {
        $description: FILE_DESCRIPTIONS[mode],
    };
    for (const [name, leaf] of collectMode(mode)) {
        const parts = name.split("-");
        let node = root as Record<string, TokenNode>;
        for (const part of parts.slice(0, -1)) {
            const existing = node[part];
            if (existing === undefined) {
                node[part] = {};
            }
            // Att går ner i ett befintligt blad är tillåtet: det skapar en
            // blandnod (token med undergrupp), t.ex. fkds.focus.indicator.color
            // med undergruppen background.
            node = node[part] as Record<string, TokenNode>;
        }
        const last = parts[parts.length - 1];
        const existing = node[last];
        if (existing === undefined) {
            node[last] = leaf;
        } else if ("$value" in existing) {
            fail(`duplicerat blad för --${name}`);
        } else {
            // Blandnod: token med undergrupper – $-egenskaperna läggs till gruppen.
            node[last] = { ...leaf, ...existing };
        }
    }
    return sortDeep(root);
}

/** Sorterar alla objektnycklar rekursivt ($-nycklar först via ASCII-ordningen). */
function sortDeep(node: TokenNode): TokenNode {
    if (Array.isArray(node)) {
        return node.map(sortDeep);
    }
    if (typeof node !== "object" || node === null) {
        return node;
    }
    const sorted: Record<string, TokenNode> = {};
    for (const key of Object.keys(node).sort()) {
        sorted[key] = sortDeep((node as Record<string, TokenNode>)[key]);
    }
    return sorted;
}

function emit(mode: Mode): void {
    const json = JSON.stringify(buildTokenTree(mode), null, 2) + "\n";
    const target = join(ROOT, "tokens", `${mode}.json`);
    writeFileSync(target, json);
    console.log(`skrev ${target}`);
}

if (import.meta.main) {
    mkdirSync(join(ROOT, "tokens"), { recursive: true });
    emit("light");
    emit("dark");
}
