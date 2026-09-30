import { test, expect } from "@playwright/test";
import { views } from "../playground/src/navigation";
import { applyThemeConfig, type ThemeConfig } from "./lib/theme";

// Three configurations per view: the felix profile in both color modes, plus
// the fkui base profile in light mode for upstream-drift detection (a change
// visible there is caused by @fkui/*, not by the felix theme layer).
const configs: ThemeConfig[] = [
    { theme: "felix", mode: "light" },
    { theme: "felix", mode: "dark" },
    { theme: "fkui", mode: "light" },
];

for (const view of views) {
    for (const config of configs) {
        test(`${view.slug} [${config.theme}/${config.mode}]`, async ({ page }) => {
            await applyThemeConfig(page, config);
            await page.goto(`/#/${view.slug}`);
            await page.waitForLoadState("networkidle");
            await expect(page).toHaveScreenshot(
                `${view.slug}-${config.theme}-${config.mode}.png`,
                { fullPage: true, maxDiffPixelRatio: 0 },
            );
        });
    }
}
