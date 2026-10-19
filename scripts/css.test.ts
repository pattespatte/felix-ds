/**
 * Paritetstest för de förbyggda CSS-posterna.
 *
 * Jämför de committade dist/{felix,felix-auto,felix-complete}.css mot färsk
 * kompilering respektive sammanfogning av samma källor: filerna måste vara
 * byteidentiska (inte föråldrade) och teckensnitts-url:erna måste skrivas om
 * och peka på existerande filer i src/fonts/files. Lagrposterna har dessutom
 * gzippade bytebudgetar – viktfördelen är en garanti, inte en tillfällighet.
 * Kör med `bun test`.
 */

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
    assemble,
    COMPLETE_OUTPUT,
    COMPLETE_SOURCES,
    compileEntry,
    ENTRIES,
} from "./build-css.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Bytebudgetar (gzippat, i byte) för standardposterna. Viktfördelen gentemot
 * ett paket som skickar allt-temat inbakat är en garanti, inte en
 * tillfällighet: på en trafiktung sajt är drygt 370 kb mindre css per
 * sidvisning en verklig skillnad. Utrymmet räcker för normal temautveckling;
 * ett brott är en signal att väga ändringen mot dess vikt. Uppmätt vid
 * v1.3.0: 5 028 respektive 4 876 byte.
 */
const BYTE_BUDGETS_GZIP: Record<string, number> = {
    "dist/felix.css": 6_000,
    "dist/felix-auto.css": 6_000,
};

/** Marginal (gzippat) för allt-i-ett-posten utöver delarnas summa. */
const COMPLETE_GZIP_MARGIN = 512;

/** Färsk sammanfogning av allt-i-ett-postens delar, i kaskadordning. */
function freshComplete(): string {
    return assemble([
        readFileSync(join(ROOT, COMPLETE_SOURCES.fkuiCss), "utf8"),
        readFileSync(join(ROOT, COMPLETE_SOURCES.fontsCss), "utf8"),
        compileEntry(COMPLETE_SOURCES.felixLayer),
    ]);
}

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

describe(`allt-i-ett-paritet (${COMPLETE_OUTPUT})`, () => {
    test("filen är identisk med färsk sammanfogning (inte föråldrad)", () => {
        const committed = readFileSync(join(ROOT, COMPLETE_OUTPUT), "utf8");
        if (committed !== freshComplete()) {
            throw new Error(`${COMPLETE_OUTPUT} är föråldrad – kör \`bun run build:theme\` och committa`);
        }
    });

    test("gzippad storlek högst delarnas summa plus marginal (delarna dubbleras inte)", () => {
        const parts = [
            readFileSync(join(ROOT, COMPLETE_SOURCES.fkuiCss)),
            readFileSync(join(ROOT, COMPLETE_SOURCES.fontsCss)),
            readFileSync(join(ROOT, "dist/felix.css")),
        ];
        const sum = parts.reduce((total, part) => total + gzipSync(part).length, 0);
        const measured = gzipSync(readFileSync(join(ROOT, COMPLETE_OUTPUT))).length;
        expect(
            measured,
            `gzippad ${COMPLETE_OUTPUT} är ${measured} byte, delsumman är ${sum} + ${COMPLETE_GZIP_MARGIN} marginal`,
        ).toBeLessThanOrEqual(sum + COMPLETE_GZIP_MARGIN);
    });
});

describe("bytebudgetar (gzippat)", () => {
    for (const [file, budget] of Object.entries(BYTE_BUDGETS_GZIP)) {
        test(`${file} högst ${budget} byte gzippat`, () => {
            const measured = gzipSync(readFileSync(join(ROOT, file))).length;
            expect(
                measured,
                `gzippad ${file} är ${measured} byte, budgeten är ${budget} – viktfördelen är en garanti; väg ändringen mot dess vikt`,
            ).toBeLessThanOrEqual(budget);
        });
    }
});
