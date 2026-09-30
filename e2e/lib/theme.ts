import type { Page } from "@playwright/test";

// Keep these strings in sync with playground/src/theme.ts. That module is not
// imported here because it pulls in vue; the spec files stay Node-side only.

export const THEME_STORAGE_KEY = "felix-playground-theme";
export const COLOR_MODE_STORAGE_KEY = "felix-playground-color-mode";

export type ThemeName = "fkui" | "felix";
export type ColorMode = "light" | "dark";

export interface ThemeConfig {
    theme: ThemeName;
    mode: ColorMode;
}

/** Seeds localStorage before any app code runs, so the very first paint is final. */
export async function applyThemeConfig(
    page: Page,
    config: ThemeConfig,
): Promise<void> {
    await page.addInitScript(
        ([themeKey, modeKey, theme, mode]) => {
            localStorage.setItem(themeKey, theme);
            localStorage.setItem(modeKey, mode);
        },
        [THEME_STORAGE_KEY, COLOR_MODE_STORAGE_KEY, config.theme, config.mode],
    );
}
