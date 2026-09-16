<script setup lang="ts">
import { ref } from "vue";
import { applyTheme, type ThemeName } from "../theme";

const current = ref<ThemeName>(
    document.documentElement.classList.contains("theme-felix") ? "felix" : "fkui",
);

function select(theme: ThemeName): void {
    current.value = theme;
    applyTheme(theme);
}
</script>

<template>
    <div class="theme-toggle" role="radiogroup" aria-label="Temaväljare">
        <label class="theme-toggle__option">
            <input
                class="theme-toggle__input"
                type="radio"
                name="theme"
                value="fkui"
                :checked="current === 'fkui'"
                @change="select('fkui')"
            />
            <span class="theme-toggle__label">FKUI grundtema</span>
        </label>
        <label class="theme-toggle__option">
            <input
                class="theme-toggle__input"
                type="radio"
                name="theme"
                value="felix"
                :checked="current === 'felix'"
                @change="select('felix')"
            />
            <span class="theme-toggle__label">felix-tema</span>
        </label>
    </div>
</template>

<style scoped lang="scss">
.theme-toggle {
    display: inline-flex;
    gap: 2px;
    padding: 2px;
    border: 1px solid var(--fkds-color-header-text-primary, currentColor);
    border-radius: 999px;
}

.theme-toggle__option {
    position: relative;
    display: inline-flex;
    cursor: pointer;
}

// Native radio inputs, visually reduced to an invisible cover of their
// segment: real radio semantics and arrow-key navigation for free, while the
// styled label next to them carries the visual state.
.theme-toggle__input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    appearance: none;
    opacity: 0;
    cursor: pointer;
}

.theme-toggle__label {
    display: inline-flex;
    align-items: center;
    min-height: 2.5rem;
    padding: 0.25rem 1rem;
    border-radius: 999px;
    color: var(--fkds-color-header-text-primary, inherit);
    white-space: nowrap;
}

// The hover background token is pale in both themes, but the header text
// token is white in FKUI grundtema – pair the hover state with the dark
// primary text color or contrast drops to ~1.2:1 (WCAG AA needs 4.5:1).
.theme-toggle__option:hover .theme-toggle__input:not(:checked) + .theme-toggle__label {
    background: var(--fkds-color-navigation-background-hover, rgba(0, 0, 0, 0.2));
    color: var(--fkds-color-text-primary, #1b1e23);
}

.theme-toggle__input:checked + .theme-toggle__label {
    background: var(--fkds-color-action-background-primary-default, #232948);
    color: var(--fkds-color-action-text-inverted-default, #ffffff);
}

.theme-toggle__input:focus-visible + .theme-toggle__label {
    box-shadow: var(--f-focus-box-shadow);
}
</style>
