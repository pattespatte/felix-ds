/**
 * Kompilerar de förbyggda CSS-posterna ur SCSS-källorna. Tre utfiler:
 *
 *   dist/felix.css           – standardposten: teckensnitt + ljust tema på :root,
 *                              mörkt tema på html[data-color-mode="dark"]
 *   dist/felix-auto.css      – systempreferensen: båda temana bakom
 *                              `prefers-color-scheme`-mediefrågor
 *   dist/felix-complete.css  – allt-i-ett: @fkui/design css, teckensnittsregeln
 *                              och felix-lagret i samma kaskadordning som de
 *                              tre importerna den ersätter (valfri bekvämlighet,
 *                              standardposten förblir det tunna lagret)
 *
 * Användning:
 *   bun run build:theme      generera dist/felix.css, dist/felix-auto.css
 *                            och dist/felix-complete.css
 *
 * Konventioner som skriptet följer:
 * - SCSS-källorna (`src/theme`, `src/fonts`) är den enda sanningskällan;
 *   posterna under `src/prebuilt/` är tunna selektorskal som bara väljer scope
 * - teckensnittsfilerna ligger kvar i `src/fonts/files` – `dist` innehåller
 *   bara css så woff2-binärerna inte dubbleras i git och paketet; sass
 *   lämnar url() orörd (relativ källfilen), så sökvägen skrivs om till
 *   `../src`
 * - mappen `dist` återskapas helt vid varje körning så att borttagna
 *   poster inte lämnas kvar
 * - utdata är deterministisk; paritetstestet i `scripts/css.test.ts`
 *   fäller föråldrade filer
 * - allt-i-ett-filen är ren textsammansättning (ingen sass-wrapper):
 *   inledande @charset plockas från varje del och exakt en @charset
 *   emitteras först om någon del hade en – @charset är bara giltig som
 *   allra första bytes i en css-fil
 */

import { compile } from "sass";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Förbyggda poster: källfil under src/ → utfil under dist/. */
export const ENTRIES: readonly { source: string; output: string }[] = [
    { source: "src/prebuilt/default.scss", output: "dist/felix.css" },
    { source: "src/prebuilt/auto.scss", output: "dist/felix-auto.css" },
];

/** Källor till allt-i-ett-posten, i kaskadordning. */
export const COMPLETE_SOURCES = {
    fkuiCss: "node_modules/@fkui/design/lib/fkui.css",
    fontsCss: "node_modules/@fkui/design/lib/fonts.css",
    felixLayer: "src/prebuilt/default.scss",
} as const;

export const COMPLETE_OUTPUT = "dist/felix-complete.css";

const FONT_URL_FROM = 'url("./files/';
const FONT_URL_TO = 'url("../src/fonts/files/';

/** Kompilerar en post och skriver om teckensnitts-url:erna till src/fonts. */
export function compileEntry(source: string): string {
    const css = compile(join(ROOT, source), {
        loadPaths: [join(ROOT, "node_modules")],
    }).css;
    return css.split(FONT_URL_FROM).join(FONT_URL_TO);
}

const CHARSET_RULE = '@charset "UTF-8";';

/**
 * Sammanfogar css-delar till en fil: inledande @charset tas bort från varje
 * del, och om någon del hade en emitteras exakt en @charset allra först.
 */
export function assemble(parts: readonly string[]): string {
    let hadCharset = false;
    const stripped = parts.map((part) => {
        if (part.startsWith(`${CHARSET_RULE}\n`)) {
            hadCharset = true;
            return part.slice(CHARSET_RULE.length + 1);
        }
        if (part.startsWith(CHARSET_RULE)) {
            hadCharset = true;
            return part.slice(CHARSET_RULE.length);
        }
        return part;
    });
    const header = hadCharset ? `${CHARSET_RULE}\n` : "";
    const body = stripped.map((part) => part.replace(/\s+$/, "")).join("\n");
    return `${header}${body}\n`;
}

if (import.meta.main) {
    rmSync(join(ROOT, "dist"), { recursive: true, force: true });
    mkdirSync(join(ROOT, "dist"), { recursive: true });
    for (const entry of ENTRIES) {
        const target = join(ROOT, entry.output);
        writeFileSync(target, compileEntry(entry.source));
        console.log(`skrev ${target}`);
    }
    const complete = assemble([
        readFileSync(join(ROOT, COMPLETE_SOURCES.fkuiCss), "utf8"),
        readFileSync(join(ROOT, COMPLETE_SOURCES.fontsCss), "utf8"),
        compileEntry(COMPLETE_SOURCES.felixLayer),
    ]);
    const completeTarget = join(ROOT, COMPLETE_OUTPUT);
    writeFileSync(completeTarget, complete);
    console.log(`skrev ${completeTarget}`);
}
