/**
 * Genererar src/icons/phosphor-spritesheet.ts – den kurerade Phosphor-uppsättningen
 * som ersätter standardikonbibliotekets teckningar bakom FIcons oförändrade
 * symbolkontrakt (`<f-icon name="...">` → `f-icon-{name}`).
 *
 * Användning:
 *   bun run icons:build        generera src/icons/phosphor-spritesheet.ts
 *
 * Konventioner som skriptet följer:
 * - MAPPINGS och WEIGHT_OVERRIDES är den enda sanningskällan; den genererade
 *   filen redigeras aldrig för hand – ändringar görs här och regenereras
 * - utdata är deterministisk: deklarationsordning, färdig konkatenerad sträng
 * - Täckningsgrind: varje namn i @fkui/icon-lib-default (spritsbladets 31
 *   symboler + stacked-keys) måste ha en mappning – tyst hål är förbjudet,
 *   skriptet felar
 * - Existensgrind: varje Phosphor-komponentnamn måste finnas exporterat ur
 *   @phosphor-icons/vue – skriptet felar
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createSSRApp, h, type Component } from "vue";
import { renderToString } from "vue/server-renderer";
import * as PhosphorIcons from "@phosphor-icons/vue";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";

/** Vikt för samtliga ikoner om inte WEIGHT_OVERRIDES säger annat. */
export const DEFAULT_WEIGHT: IconWeight = "bold";

/**
 * Per-ikon-undantag från DEFAULT_WEIGHT. Begin empty – en post här + regeneration
 * är enda vägen att avvika; den genererade filen redigeras aldrig för hand.
 */
export const WEIGHT_OVERRIDES: Record<string, IconWeight> = {};

/**
 * felix-ikonnamn -> Phosphor-komponent i @phosphor-icons/vue. Ordningen är
 * genereringsordningen (FB-ikonerna först, därefter den kurerade utökningen).
 * Aliaser är medvetna: close/cross -> X, info/tooltip -> Info, i -> Info
 * (Phosphor har inga enskilda bokstavsglyfer).
 */
export const MAPPINGS: Record<string, string> = {
    // --- names from @fkui/icon-lib-default (31 symbols) ---
    alert: "PhExclamationMark",
    "arrow-down": "PhArrowDown",
    "arrow-in-circle": "PhArrowCircleRight",
    "arrow-right": "PhArrowRight",
    bars: "PhList",
    bell: "PhBell",
    calendar: "PhCalendar",
    "caret-down": "PhCaretDown",
    "caret-up": "PhCaretUp",
    "chevrons-left": "PhCaretDoubleLeft",
    circle: "PhCircle",
    "circle-notch-solid": "PhCircleNotch",
    close: "PhX",
    cross: "PhX", // alias of close
    dash: "PhMinus",
    doc: "PhFileText",
    ellipsis: "PhDotsThree",
    error: "PhWarning",
    file: "PhFile",
    i: "PhInfo", // alias of info (no bare-letter glyphs in Phosphor)
    "new-window": "PhArrowSquareOut",
    "paper-clip": "PhPaperclip",
    pdf: "PhFilePdf",
    pen: "PhPencil",
    pic: "PhImage",
    plus: "PhPlus",
    search: "PhMagnifyingGlass",
    sort: "PhArrowsDownUp",
    success: "PhCheck",
    trashcan: "PhTrash",
    triangle: "PhTriangle",
    // --- stacked composites from stacked-icons.json (single glyphs) ---
    info: "PhInfo",
    warning: "PhWarningCircle",
    tooltip: "PhInfo", // alias of info
    // --- curated expansion ---
    "check-circle": "PhCheckCircle",
    "x-circle": "PhXCircle",
    clock: "PhClock",
    envelope: "PhEnvelope",
    "chat-circle": "PhChatCircle",
    phone: "PhPhone",
    printer: "PhPrinter",
    house: "PhHouse",
    user: "PhUser",
    users: "PhUsers",
    "user-circle": "PhUserCircle",
    lock: "PhLock",
    key: "PhKey",
    eye: "PhEye",
    "eye-slash": "PhEyeSlash",
    copy: "PhCopy",
    gear: "PhGear",
    funnel: "PhFunnel",
    bookmark: "PhBookmark",
    star: "PhStar",
    globe: "PhGlobe",
    link: "PhLink",
    folder: "PhFolder",
    "folder-open": "PhFolderOpen",
    "chart-bar": "PhChartBar",
    "chart-pie": "PhChartPie",
    lightning: "PhLightning",
    "seal-check": "PhSealCheck",
    "shield-check": "PhShieldCheck",
    question: "PhQuestion",
    "download-simple": "PhDownloadSimple",
    "upload-simple": "PhUploadSimple",
};

/** FKUI:s kanoniska namnlista ur det installerade @fkui/icon-lib-default. */
function readFkuiNames(): { symbols: string[]; stacked: string[] } {
    const base = join(
        ROOT,
        "node_modules",
        "@fkui",
        "icon-lib-default",
        "dist",
    );
    const symbolsMeta = JSON.parse(
        readFileSync(join(base, "f", "spritesheet.json"), "utf8"),
    ) as { name: string }[];
    const stackedMeta = JSON.parse(
        readFileSync(join(base, "stacked-icons.json"), "utf8"),
    ) as { key: string }[];
    return {
        symbols: symbolsMeta.map((m) => m.name),
        stacked: stackedMeta.map((m) => m.key),
    };
}

async function renderIconPaths(
    component: Component,
    iconName: string,
): Promise<string> {
    const weight = WEIGHT_OVERRIDES[iconName] ?? DEFAULT_WEIGHT;
    const html = await renderToString(
        createSSRApp({ render: () => h(component, { weight }) }),
    );
    // SSR emits fragment anchor comments around the <g> wrapper; keep the
    // inner path markup only.
    const inner = html
        .replace(/<!--[\s\S]*?-->/g, "")
        .match(/<g>([\s\S]*)<\/g>/)?.[1]
        ?.trim();
    if (!inner) {
        throw new Error(`no <g> wrapper in SSR output for ${iconName}`);
    }
    const unexpected = inner.match(/<(?!path[\s>])\w+/);
    if (unexpected) {
        throw new Error(
            `expected only <path> elements for ${iconName}, found ${unexpected[0]}`,
        );
    }
    // Phosphor relies on fill inherited from the <svg> root; make it explicit
    // on each path so the symbol colors from CSS like FKUI glyphs.
    return inner.replaceAll("<path ", '<path fill="currentColor" ');
}

async function main(): Promise<void> {
    const fkui = readFkuiNames();
    const required = [...fkui.symbols, ...fkui.stacked];
    const missingCoverage = required.filter((name) => !(name in MAPPINGS));
    if (missingCoverage.length > 0) {
        throw new Error(
            `coverage gate: no mapping for FKUI icon name(s): ${missingCoverage.join(", ")}`,
        );
    }

    const components = PhosphorIcons as unknown as Record<string, Component>;
    const lines: string[] = [];
    const names = Object.keys(MAPPINGS);
    for (const name of names) {
        const componentName = MAPPINGS[name];
        const component = components[componentName];
        if (!component) {
            throw new Error(
                `existence gate: @phosphor-icons/vue has no export named ${componentName} (mapped from "${name}")`,
            );
        }
        const weight = WEIGHT_OVERRIDES[name] ?? DEFAULT_WEIGHT;
        const paths = await renderIconPaths(component, name);
        lines.push(
            `    '<symbol id="f-icon-${name}" viewBox="0 0 256 256" data-phosphor-weight="${weight}">${paths}</symbol>'`,
        );
        console.log(`  ✓ ${name} (${weight})`);
    }

    const header = `// GENERATED FILE — do not edit. Regenerate with \`bun run icons:build\`.
//
// Phosphor icon set (https://phosphoricons.com) — MIT license, (c) Phosphor
// Icons — rendered from @phosphor-icons/vue at the weight noted per symbol.
// This sheet REPLACES the default icon library's artwork behind FIcon's
// unchanged symbol contract (<f-icon name="..."> resolves f-icon-{name});
// import it INSTEAD of @fkui/icon-lib-default/dist/f — never both (duplicate
// symbol ids resolve to whichever sheet entered the DOM first).
//
// Symbols (${names.length}): ${names.join(", ")}.

export const SPRITESHEET =
    '<svg xmlns="http://www.w3.org/2000/svg" focusable="false">' +
`;
    const closingSvg = `    '</svg>'

export const PHOSPHOR_ICON_NAMES: readonly string[] = [
${names.map((n) => `    "${n}",`).join("\n")}
]
`;

    const footer = `
// Mirrors @fkui/icon-lib-default's injection: a hidden <div> appended to
// <body>, after DOMContentLoaded when the document is still loading.
function injectSpritesheet(): void {
    const element = document.createElement("div");
    element.innerHTML = SPRITESHEET;
    element.style.display = "none";
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("data-icon-package", "phosphor-icons (via @pattespatte/felix-ds)");
    element.setAttribute("data-icon-library", "f");
    document.body.append(element);
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            injectSpritesheet();
        });
    } else {
        injectSpritesheet();
    }
}
`;

    const content =
        header +
        lines.map((line) => `${line} +`).join("\n") +
        "\n" +
        closingSvg +
        footer;

    const target = join(ROOT, "src", "icons", "phosphor-spritesheet.ts");
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content, "utf8");
    console.log(
        `wrote ${target.replace(ROOT + "/", "")} (${names.length} symbols, FKUI coverage ${required.length}/${required.length})`,
    );
}

main().catch((err: unknown) => {
    console.error("[icons] failed:", err);
    process.exit(1);
});
