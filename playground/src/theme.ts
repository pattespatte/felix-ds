import { ref } from "vue";

export const THEME_STORAGE_KEY = "felix-playground-theme";
export const COLOR_MODE_STORAGE_KEY = "felix-playground-color-mode";

export type ThemeName = "fkui" | "felix";
export type ColorMode = "light" | "dark";

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

// Color mode follows the system preference until the user makes an explicit
// choice (the toggle persists one); with no stored choice, system changes
// keep driving the page. The dark scope is attribute-based so it composes
// with the theme-felix class (profile × mode are orthogonal axes).
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function storedMode(): ColorMode | null {
    const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
}

function systemMode(): ColorMode {
    return prefersDark.matches ? "dark" : "light";
}

function setColorMode(mode: ColorMode): void {
    currentColorMode.value = mode;
    if (mode === "dark") {
        document.documentElement.setAttribute("data-color-mode", "dark");
    } else {
        document.documentElement.removeAttribute("data-color-mode");
    }
}

export const currentColorMode = ref<ColorMode>(storedMode() ?? systemMode());

export function applyColorMode(mode: ColorMode): void {
    setColorMode(mode);
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
}

export function toggleColorMode(): void {
    applyColorMode(currentColorMode.value === "dark" ? "light" : "dark");
}

/** Restores the stored choice (or the system preference) before mount. */
export function restoreColorMode(): void {
    setColorMode(storedMode() ?? systemMode());
}

prefersDark.addEventListener("change", (event) => {
    // Only follow the system while the user has not made an explicit choice.
    if (storedMode() === null) {
        setColorMode(event.matches ? "dark" : "light");
    }
});
