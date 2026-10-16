import { test } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";
import { views } from "../playground/src/navigation";
import { applyThemeConfig, type ThemeConfig } from "./lib/theme";

// The playground is axe-clean today; this gate exists so a release cannot
// regress that. No rules are disabled. If a violation ever appears here, fix
// it or trace it upstream before releasing – only a violation proven to live
// inside FKUI's published packages (unfixable here without a forbidden fork
// or wrapper) may be added to a documented disable list.
const configs: ThemeConfig[] = [
    { theme: "felix", mode: "light" },
    { theme: "felix", mode: "dark" },
];

for (const view of views) {
    for (const config of configs) {
        test(`${view.slug} [${config.theme}/${config.mode}]`, async ({ page }) => {
            await applyThemeConfig(page, config);
            await page.goto(`/#/${view.slug}`);
            await page.waitForLoadState("networkidle");
            await injectAxe(page);
            await checkA11y(page, undefined, undefined, false);
        });
    }
}

// The header search box ships on every page, but its listbox only renders
// while the field is focused with a query – the scans above never see it.
// Scan the open dropdown state explicitly so the interactive layer stays
// axe-clean too (index fetch on focus + 300 ms debounce, hence the selector
// wait before axe runs).
for (const config of configs) {
    test(`search-dropdown [${config.theme}/${config.mode}]`, async ({ page }) => {
        await applyThemeConfig(page, config);
        await page.goto("/#/start");
        await page.waitForLoadState("networkidle");
        const input = page.getByPlaceholder("Sök...");
        await input.click();
        await input.fill("text");
        await page.waitForSelector(".search-results__list .search-results__item");
        await injectAxe(page);
        await checkA11y(page, undefined, undefined, false);
    });
}
