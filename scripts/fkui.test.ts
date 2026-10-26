/**
 * Enhetstest för komponentlistan i fkui-hjälpredan. Låser mönsterkontraktet
 * mot @fkui/vue:s utrullade index.d.ts: exakt komponentkonstanterna (`export
 * declare const F…`), inte enum:er, alias eller indragna deklarationer, och
 * alltid sorterat utan dubbletter – valutaarbetsflödet diffar utdatan med
 * `comm` och förlitar sig på det. Samma sak för statuslistan: endast
 * `@deprecated` i JSDoc-blocket omedelbart ovanför en export räknas.
 * Kör med `bun test`.
 */

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractComponentNames, extractDeprecatedNames } from "./fkui.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * FDataTable-förväntningen nedan är versionsberoende: `@deprecated`-markeringen
 * tillkom uppströms först i en minor efter golvet 6.57.0, där exporten finns
 * men är omarkerad. I floor-benet i currency-arbetsflödet
 * (.github/workflows/fkui-currency.yml) installeras just golvet, så där hoppas
 * förväntningen över (FKUI_FLOOR=1) – övriga påståenden i testet gäller oavsett
 * version.
 */
const AT_FKUI_FLOOR = process.env.FKUI_FLOOR === "1";

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

describe("extractDeprecatedNames", () => {
    test("träffar @deprecated i blocket omedelbart ovanför exporten", () => {
        const source = [
            "/**",
            " * @deprecated Use `<f-table>` instead.",
            " */",
            "export declare const FDataTable: typeof __VLS_export_10;",
            "/** @deprecated Use `<f-table>` instead. */",
            "export declare const FInteractiveTable: typeof __VLS_export_24;",
            "/**",
            " * Level: Ready",
            " */",
            "export declare const FButton: typeof __VLS_export_2;",
        ].join("\n");
        expect(extractDeprecatedNames(source)).toEqual(
            new Set(["FDataTable", "FInteractiveTable"]),
        );
    });

    test("en annan export mellan blocket och komponenten bryter kopplingen", () => {
        const source = [
            "/**",
            " * @deprecated Use `filterLabel` instead.",
            " */",
            "export declare const EventBus: EventBus;",
            "export declare const FBadge: typeof __VLS_export;",
        ].join("\n");
        expect(extractDeprecatedNames(source)).toEqual(new Set());
    });

    test("föråldrade egenskaper inne i ett interface läcker inte ut", () => {
        const source = [
            "export declare interface FContextMenuProps {",
            "    /**",
            "     * @deprecated Use `filterLabel` instead.",
            "     */",
            "    filterLabel?: string;",
            "}",
            "export declare const FContextMenu: typeof __VLS_export_7;",
        ].join("\n");
        expect(extractDeprecatedNames(source)).toEqual(new Set());
    });

    test("den installerade paketversionen markerar föråldrade komponenter", () => {
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
        const source = readFileSync(types, "utf8");
        const names = extractComponentNames(source);
        const deprecated = extractDeprecatedNames(source);
        for (const name of deprecated) {
            expect(names).toContain(name);
        }
        if (!AT_FKUI_FLOOR && names.includes("FDataTable")) {
            expect(deprecated.has("FDataTable")).toBe(true);
        }
        expect(deprecated.has("FButton")).toBe(false);
    });
});
