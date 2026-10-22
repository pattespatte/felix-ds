/**
 * Enhetstest för komponentlistan i fkui-hjälpredan. Låser mönsterkontraktet
 * mot @fkui/vue:s utrullade index.d.ts: exakt komponentkonstanterna (`export
 * declare const F…`), inte enum:er, alias eller indragna deklarationer, och
 * alltid sorterat utan dubbletter – valutaarbetsflödet diffar utdatan med
 * `comm` och förlitar sig på det. Kör med `bun test`.
 */

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractComponentNames } from "./fkui.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const DECLARATION_SNIPPET = `import type { FC } from "vue";
export declare const FLabel: typeof __VLS_export_2;
declare const _default: typeof __VLS_export_2;
export { _default as FFormModalAction };
export declare const FButton: typeof __VLS_export_2;
    export declare const FIndented: string;
export declare function useFLabel(): void;
export declare const FValidationForm: typeof __VLS_export_2;
export declare const FButton: typeof __VLS_export_2;
`;

describe("extractComponentNames", () => {
    test("plockar ut komponentkonstanterna, sorterat och utan dubbletter", () => {
        expect(extractComponentNames(DECLARATION_SNIPPET)).toEqual([
            "FButton",
            "FLabel",
            "FValidationForm",
        ]);
    });

    test("träffar inte enum-, alias- eller indragna deklarationer", () => {
        const source = [
            "export declare enum FKUIConfigButtonOrder {",
            "    A = 'a',",
            "}",
            "export { _default as FFormModalAction };",
            "    export declare const FTableColumnSize: string;",
            "export declare const useFLabel: () => void;",
        ].join("\n");
        expect(extractComponentNames(source)).toEqual([]);
    });

    test("tom utdata på källa utan komponentdeklarationer", () => {
        expect(
            extractComponentNames("export declare const useFLabel: () => void;\n"),
        ).toEqual([]);
    });

    test("den installerade paketversionen har en icke-tom, sorterad lista", () => {
        const types = resolve(
            ROOT,
            "node_modules",
            "@fkui",
            "vue",
            "dist",
            "types",
            "index.d.ts",
        );
        if (!existsSync(types)) {
            throw new Error("node_modules/@fkui/vue är inte installerad – kör `bun install`");
        }
        const names = extractComponentNames(readFileSync(types, "utf8"));
        expect(names.length).toBeGreaterThan(70);
        expect([...names].sort()).toEqual(names);
        expect(new Set(names).size).toBe(names.length);
    });
});
