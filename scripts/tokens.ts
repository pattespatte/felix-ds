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
// Granskning (engångssteg i task phase-1-extract-01): skriver ut varje
// distinkt värdeform per läge så att täckningen mot typkartan kan kontrolleras.
// ---------------------------------------------------------------------------

interface Shape {
    test: (value: string) => boolean;
    label: string;
}

const SHAPES: Shape[] = [
    { label: "hex-färg", test: (v) => /^#[0-9a-fA-F]{3,8}$/.test(v) },
    { label: "rgb/hsl-färg", test: (v) => /^(rgba?|hsla?)\(/.test(v) },
    { label: "px-dimension", test: (v) => /^-?\d+(\.\d+)?px$/.test(v) },
    { label: "rem/em-dimension", test: (v) => /^-?\d+(\.\d+)?(rem|em)$/.test(v) },
    { label: "typolöst tal", test: (v) => /^-?\d+(\.\d+)?$/.test(v) },
    { label: "none", test: (v) => v === "none" },
    { label: "hel-var-alias", test: (v) => /^var\(--[a-zA-Z0-9-]+\)$/.test(v) },
    { label: "url", test: (v) => /^url\(/.test(v) },
    { label: "citerad sträng", test: (v) => /^"[^"]*"$/.test(v) },
    { label: "nyckelord", test: (v) => /^[a-z-]+$/.test(v) },
];

function shapeOf(value: string): string {
    for (const shape of SHAPES) {
        if (shape.test(value)) {
            return shape.label;
        }
    }
    return "OTYDDAD";
}

if (import.meta.main) {
    for (const mode of ["light", "dark"] as Mode[]) {
        const css = compileMode(mode);
        const declarations = parseRootDeclarations(css);

        // Anpassade egenskaper deklarerade i andra block än exakt :root –
        // förväntat svar: inga (var()-referenser i komponentregler räknas inte).
        const stray: string[] = [];
        for (const block of topLevelBlocks(css)) {
            if (block.selector === ":root") {
                continue;
            }
            const withoutRefs = block.body.replace(/var\(--[a-zA-Z0-9-]+(,[^)]*)?\)/g, "");
            for (const m of withoutRefs.matchAll(/--([a-zA-Z0-9-]+)\s*:/g)) {
                stray.push(`${block.selector} → ${m[1]}`);
            }
        }

        const buckets = new Map<string, string[]>();
        for (const [name, value] of declarations) {
            const label = shapeOf(value);
            const list = buckets.get(label) ?? [];
            if (label === "OTYDDAD" || list.length < 4) {
                list.push(`${name} = ${value}`);
            } else if (list.length === 4) {
                list.push("…");
            }
            buckets.set(label, list);
        }

        console.log(`\n=== ${mode}: ${declarations.size} token, ${stray.length} deklarationer utanför :root ===`);
        for (const s of stray.slice(0, 10)) {
            console.log(`  STRAY: ${s}`);
        }
        for (const [label, examples] of [...buckets.entries()].sort()) {
            console.log(`  [${label}] (${examples.length >= 5 ? "4+" : examples.length})`);
            for (const example of examples) {
                console.log(`      ${example}`);
            }
        }
    }
}
