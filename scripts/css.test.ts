/**
 * Paritetstest för de förbyggda CSS-posterna.
 *
 * Jämför de committade dist/{felix,felix-auto}.css mot färsk kompilering av
 * samma SCSS-källor: filerna måste vara byteidentiska (inte föråldrade) och
 * teckensnitts-url:erna måste skrivas om och peka på existerande filer i
 * src/fonts/files. Kör med `bun test`.
 */

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compileEntry, ENTRIES } from "./build-css.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

for (const entry of ENTRIES) {
    describe(`förbyggd css-paritet (${entry.output})`, () => {
        test("filen är identisk med färsk kompilering (inte föråldrad)", () => {
            const committed = readFileSync(join(ROOT, entry.output), "utf8");
            if (committed !== compileEntry(entry.source)) {
                throw new Error(`${entry.output} är föråldrad – kör \`bun run build:theme\` och committa`);
            }
        });

        test("teckensnitts-url:er skrivs om och pekar på existerande filer", () => {
            const css = readFileSync(join(ROOT, entry.output), "utf8");
            expect(css.includes('url("./files/'), "url()-omskrivningen har inte verkställts").toBe(false);
            const files = [...css.matchAll(/url\("\.\.\/src\/fonts\/files\/([^"]+)"\)/g)].map((match) => match[1]);
            expect(files.length, "väntar ett @font-face per teckensnittsfil (5)").toBe(5);
            for (const file of files) {
                expect(existsSync(join(ROOT, "src", "fonts", "files", file)), `saknar src/fonts/files/${file}`).toBe(true);
            }
        });
    });
}
