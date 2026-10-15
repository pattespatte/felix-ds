/**
 * Kompilerar de förbyggda CSS-posterna ur SCSS-källorna. Två utfiler:
 *
 *   dist/felix.css       – standardposten: teckensnitt + ljust tema på :root,
 *                          mörkt tema på html[data-color-mode="dark"]
 *   dist/felix-auto.css  – systempreferensen: båda teman bakom
 *                          prefers-color-scheme-mediafrågor
 *
 * Användning:
 *   bun run build:theme      generera dist/felix.css och dist/felix-auto.css
 *
 * Konventioner som skriptet följer:
 * - SCSS-källorna (src/theme, src/fonts) är den enda sanningskällan; posterna
 *   under src/prebuilt/ är tunna selektorskal som bara väljer scope
 * - teckensnittsfilerna ligger kvar i src/fonts/files – dist innehåller bara
 *   css så woff2-binärerna inte dubbleras i git och paketet; sass lämnar
 *   url() orörd (relativ källfilen), så sökvägen skrivs om till ../src
 * - dist återskapas helgt vid varje körning så borttagna poster lämnas kvar
 * - utdata är deterministisk; paritetstestet i scripts/css.test.ts fäller
 *   föråldrade filer
 */

import { compile } from "sass";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Förbyggda poster: källfil under src/ → utfil under dist/. */
export const ENTRIES: readonly { source: string; output: string }[] = [
    { source: "src/prebuilt/default.scss", output: "dist/felix.css" },
    { source: "src/prebuilt/auto.scss", output: "dist/felix-auto.css" },
];

const FONT_URL_FROM = 'url("./files/';
const FONT_URL_TO = 'url("../src/fonts/files/';

/** Kompilerar en post och skriver om teckensnitts-url:erna till src/fonts. */
export function compileEntry(source: string): string {
    const css = compile(join(ROOT, source), {
        loadPaths: [join(ROOT, "node_modules")],
    }).css;
    return css.split(FONT_URL_FROM).join(FONT_URL_TO);
}

if (import.meta.main) {
    rmSync(join(ROOT, "dist"), { recursive: true, force: true });
    mkdirSync(join(ROOT, "dist"), { recursive: true });
    for (const entry of ENTRIES) {
        const target = join(ROOT, entry.output);
        writeFileSync(target, compileEntry(entry.source));
        console.log(`skrev ${target}`);
    }
}
