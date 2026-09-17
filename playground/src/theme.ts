import { ref } from "vue";

export const THEME_STORAGE_KEY = "felix-playground-theme";

export type ThemeName = "fkui" | "felix";

// Initialized from storage, not the DOM class: this module evaluates before
// restoreTheme() runs, so the html element does not carry the class yet.
export const currentTheme = ref<ThemeName>(
    localStorage.getItem(THEME_STORAGE_KEY) === "felix" ? "felix" : "fkui",
);

export function applyTheme(theme: ThemeName): void {
    currentTheme.value = theme;
    document.documentElement.classList.toggle("theme-felix", theme === "felix");
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/** Restores the persisted choice before the app mounts to avoid a flash. */
export function restoreTheme(): void {
    if (localStorage.getItem(THEME_STORAGE_KEY) === "felix") {
        document.documentElement.classList.add("theme-felix");
    }
}
