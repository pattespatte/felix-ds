import { test, expect } from "@playwright/test";
import { crossBrowserViewSlugs, views } from "../playground/src/navigation";
import { stubVersionBadge } from "./lib/badge";
import { applyThemeConfig, type ThemeConfig } from "./lib/theme";

// Cross-browser half of the release gate: every playground view
// (crossBrowserViewSlugs in playground/src/navigation.ts) in the felix
// profile and both color modes, rendered by the firefox and webkit
// projects (testMatch in playwright.config.ts). The full 15-view × 3-config
// matrix stays chromium-only in visual.spec.ts; the fkui/light drift config
// is browser-independent and stays there too. Baselines are linux-only
// (release runner); any darwin set generated for local proof is deleted
// again (docs/release.en.md).

test.skip(
    ({ browserName }) => browserName !== "firefox" && browserName !== "webkit",
    "visual-cross runs only in the firefox and webkit projects",
);

const configs: ThemeConfig[] = [
    { theme: "felix", mode: "light" },
    { theme: "felix", mode: "dark" },
];

for (const view of views.filter((candidate) =>
    crossBrowserViewSlugs.includes(candidate.slug),
)) {
    for (const config of configs) {
        test(`${view.slug} [${config.theme}/${config.mode}]`, async ({
            page,
        }) => {
            await applyThemeConfig(page, config);
            await stubVersionBadge(page);
            await page.goto(`/#/${view.slug}`);
            await page.waitForLoadState("networkidle");
            await expect(page).toHaveScreenshot(
                `${view.slug}-${config.theme}-${config.mode}.png`,
                { fullPage: true, maxDiffPixelRatio: 0 },
            );
        });
    }
}
