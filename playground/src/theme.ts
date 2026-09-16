export const THEME_STORAGE_KEY = "felix-playground-theme";

export type ThemeName = "fkui" | "felix";

export function applyTheme(theme: ThemeName): void {
    document.documentElement.classList.toggle("theme-felix", theme === "felix");
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/** Restores the persisted choice before the app mounts to avoid a flash. */
export function restoreTheme(): void {
    if (localStorage.getItem(THEME_STORAGE_KEY) === "felix") {
        document.documentElement.classList.add("theme-felix");
    }
}
