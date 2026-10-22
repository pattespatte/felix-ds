import { test, expect } from "@playwright/test";
import {
    applyThemeConfig,
    COLOR_MODE_STORAGE_KEY,
    THEME_STORAGE_KEY,
} from "./lib/theme";

// Functional companion to the visual matrix: proves that ?profile= and
// ?mode= override the stored choice while present in the address, without
// writing to localStorage, and that invalid values fall through to storage.
// No screenshots – the specs stay out of the baseline matrix.

test("URL-parametrar vinner över sparat val utan att skriva över det", async ({ page }) => {
    await applyThemeConfig(page, { theme: "fkui", mode: "light" });
    await page.goto("/?profile=felix&mode=dark#/start");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveClass(/theme-felix/);
    await expect(page.locator("html")).toHaveAttribute("data-color-mode", "dark");
    expect(await page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY)).toBe("fkui");
    expect(await page.evaluate((key) => localStorage.getItem(key), COLOR_MODE_STORAGE_KEY)).toBe("light");
});

test("utan parametrar respekteras det sparade valet", async ({ page }) => {
    await applyThemeConfig(page, { theme: "felix", mode: "dark" });
    await page.goto("/#/start");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveClass(/theme-felix/);
    await expect(page.locator("html")).toHaveAttribute("data-color-mode", "dark");
});

test("ogiltiga parametervärden ignoreras", async ({ page }) => {
    await applyThemeConfig(page, { theme: "fkui", mode: "light" });
    await page.goto("/?profile=banana&mode=banana#/start");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).not.toHaveClass(/theme-felix/);
    await expect(page.locator("html")).not.toHaveAttribute("data-color-mode");
});
