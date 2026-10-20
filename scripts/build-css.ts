/**
 * Kompilerar de förbyggda CSS-posterna ur SCSS-källorna. Sex utfiler: tre
 * läsbara poster och deras minifierade syskon (samma regler, komprimerade –
 * för förbrukare som laddar posten som ren <link>-css utan byggkedja):
 *
 *   dist/felix.css              – standardposten: teckensnitt + ljust tema på
 *                                 :root, mörkt tema på html[data-color-mode="dark"]
 *   dist/felix-auto.css         – systempreferensen: båda temana bakom
 *                                 `prefers-color-scheme`-mediefrågor
 *   dist/felix-complete.css     – allt-i-ett: @fkui/design css, teckensnittsregeln
 *                                 och felix-lagret i samma kaskadordning som de
 *                                 tre importerna den ersätter (valfri bekvämlighet,
 *                                 standardposten förblir det tunna lagret)
 *   dist/felix.min.css, dist/felix-auto.min.css, dist/felix-complete.min.css
 *                               – minifierade syskon till posterna ovan
 *
 * Användning:
 *   bun run build:theme      generera dist/felix.css, dist/felix-auto.css
 *                            och dist/felix-complete.css samt .min.css-syskonen
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
 * - minifieringen kör sass i `syntax: "css"`-läge: utöver att komprimera
 *   parsar den varje färdig post som ren css, så ogiltig css fäller bygget
 *   i stället för att skeppas
 */

import { compile, compileString } from "sass";
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
export const COMPLETE_MIN_OUTPUT = "dist/felix-complete.min.css";

const FONT_URL_FROM = 'url("./files/';
const FONT_URL_TO = 'url("../src/fonts/files/';

/** Utfil till en läsbar posts minifierade syskon: dist/fel.css → dist/fel.min.css. */
export function minifiedOutput(output: string): string {
    return output.replace(/\.css$/, ".min.css");
}

/** Kompilerar en post och skriver om teckensnitts-url:erna till src/fonts. */
export function compileEntry(source: string): string {
    const css = compile(join(ROOT, source), {
        loadPaths: [join(ROOT, "node_modules")],
    }).css;
    return css.split(FONT_URL_FROM).join(FONT_URL_TO);
}

/**
 * Minifierar en färdig css-sträng. `syntax: "css"` läser indata som ren css:
 * utdata påverkas bara av komprimeringen, och en ogiltig post kastar – vilket
 * gör minifieraren till en permanent syntaxkontroll av varje bygge.
 * `charset: false` stoppar sass från att skjuta in en egen BOM/@charset mitt
 * i utdatan; @charset-hanteringen ägs av anroparen (se minifyComplete).
 */
export function minify(css: string): string {
    return compileString(css, {
        style: "compressed",
        syntax: "css",
        charset: false,
    }).css;
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

/**
 * Minifierar allt-i-ett-posten. @charset plockas bort före minifieringen och
 * sätts tillbaka först – regeln är bara giltig som allra första bytes, och
 * filen innehåller icke-ASCII-tecken från upstream-delen.
 */
export function minifyComplete(complete: string): string {
    const header = complete.startsWith(`${CHARSET_RULE}\n`)
        ? `${CHARSET_RULE}\n`
        : "";
    const body = header ? complete.slice(CHARSET_RULE.length + 1) : complete;
    return `${header}${minify(body)}`;
}

if (import.meta.main) {
    rmSync(join(ROOT, "dist"), { recursive: true, force: true });
    mkdirSync(join(ROOT, "dist"), { recursive: true });
    for (const entry of ENTRIES) {
        const css = compileEntry(entry.source);
        writeFileSync(join(ROOT, entry.output), css);
        writeFileSync(join(ROOT, minifiedOutput(entry.output)), minify(css));
        console.log(`skrev ${join(ROOT, entry.output)}`);
        console.log(`skrev ${join(ROOT, minifiedOutput(entry.output))}`);
    }
    const complete = assemble([
        readFileSync(join(ROOT, COMPLETE_SOURCES.fkuiCss), "utf8"),
        readFileSync(join(ROOT, COMPLETE_SOURCES.fontsCss), "utf8"),
        compileEntry(COMPLETE_SOURCES.felixLayer),
    ]);
    const completeTarget = join(ROOT, COMPLETE_OUTPUT);
    writeFileSync(completeTarget, complete);
    writeFileSync(join(ROOT, COMPLETE_MIN_OUTPUT), minifyComplete(complete));
    console.log(`skrev ${completeTarget}`);
    console.log(`skrev ${join(ROOT, COMPLETE_MIN_OUTPUT)}`);
}
