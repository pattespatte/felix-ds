/**
 * Paritetstest för Phosphor-spritesheetet (tasks phase-1-test-04).
 *
 * Låser kontraktet mellan den genererade filen, FKUI:s ikonmetadata och
 * PRD:ns uppsättningsstorlek: varje FKUI-namn (spritsbladets symboler +
 * stacked-nycklar) måste finnas, symbolerna i sheetet måste exakt motsvara
 * den exporterade namnlistan (i båda riktningarna), totalen måste ligga i
 * intervallet 50–70, och så länge WEIGHT_OVERRIDES är tom får ingen vikt
 * avvika från bold. Kör med `bun test`.
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { WEIGHT_OVERRIDES } from "./icons.ts";
import {
    PHOSPHOR_ICON_NAMES,
    SPRITESHEET,
} from "../src/icons/phosphor-spritesheet.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readFkuiNames(): string[] {
    const base = join(
        ROOT,
        "node_modules",
        "@fkui",
        "icon-lib-default",
        "dist",
    );
    const symbols = (
        JSON.parse(
            readFileSync(join(base, "f", "spritesheet.json"), "utf8"),
        ) as { name: string }[]
    ).map((m) => m.name);
    const stacked = (
        JSON.parse(readFileSync(join(base, "stacked-icons.json"), "utf8")) as {
            key: string;
        }[]
    ).map((m) => m.key);
    return [...new Set([...symbols, ...stacked])];
}

function sheetSymbolIds(): Set<string> {
    return new Set(
        [...SPRITESHEET.matchAll(/<symbol id="([^"]+)"[^>]*>/g)].map((m) =>
            m[1].replace(/^f-icon-/, ""),
        ),
    );
}

describe("phosphor spritesheet parity", () => {
    test("every FKUI icon name is covered", () => {
        const listed = new Set(PHOSPHOR_ICON_NAMES);
        const missing = readFkuiNames().filter((name) => !listed.has(name));
        expect(missing).toEqual([]);
    });

    test("sheet symbols and exported names match exactly (both directions)", () => {
        const sheet = sheetSymbolIds();
        const listed = new Set(PHOSPHOR_ICON_NAMES);
        expect([...listed].filter((n) => !sheet.has(n))).toEqual([]);
        expect([...sheet].filter((n) => !listed.has(n))).toEqual([]);
        expect(sheet.size).toBe(PHOSPHOR_ICON_NAMES.length);
    });

    test("set size stays within the PRD contract (50–70)", () => {
        expect(PHOSPHOR_ICON_NAMES.length).toBeGreaterThanOrEqual(50);
        expect(PHOSPHOR_ICON_NAMES.length).toBeLessThanOrEqual(70);
    });

    test("with empty WEIGHT_OVERRIDES every symbol is bold", () => {
        const weights = [
            ...SPRITESHEET.matchAll(/data-phosphor-weight="([^"]+)"/g),
        ].map((m) => m[1]);
        expect(Object.keys(WEIGHT_OVERRIDES)).toEqual([]);
        expect(weights).toHaveLength(PHOSPHOR_ICON_NAMES.length);
        expect([...new Set(weights)]).toEqual(["bold"]);
    });
});
