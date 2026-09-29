<script setup lang="ts">
import { applyTheme, currentTheme } from "../theme";
</script>

<template>
    <div class="theme-toggle" role="radiogroup" aria-label="Temaväljare">
        <label class="theme-toggle__option">
            <input
                class="theme-toggle__input"
                type="radio"
                name="theme"
                value="fkui"
                :checked="currentTheme === 'fkui'"
                @change="applyTheme('fkui')"
            />
            <span class="theme-toggle__label">FKUI grundtema</span>
        </label>
        <label class="theme-toggle__option">
            <input
                class="theme-toggle__input"
                type="radio"
                name="theme"
                value="felix"
                :checked="currentTheme === 'felix'"
                @change="applyTheme('felix')"
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
    // Follows the header text colour, so the segment boundary keeps >= 3:1
    // against the header background in every theme × color-mode combination
    // (WCAG 2.2, 1.4.11) – including the checked segment, whose fill token
    // alone sits at ~1:1 on the grundtema header.
    border: 1px solid var(--fkds-color-header-text-primary, currentColor);
    border-radius: 999px;
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

// Dark translucent overlay instead of a theme token: the header text token
// stays readable on it in all four theme × color-mode combinations
// (>= 4.5:1), while navigation-background-hover pairs below AA with
// text-primary in grundtema dark (~1.7:1).
.theme-toggle__option:hover .theme-toggle__input:not(:checked) + .theme-toggle__label {
    background: rgba(0, 0, 0, 0.2);
}

.theme-toggle__input:checked + .theme-toggle__label {
    background: var(--fkds-color-action-background-primary-default, #232948);
    color: var(--fkds-color-action-text-inverted-default, #ffffff);
}

.theme-toggle__input:focus-visible + .theme-toggle__label {
    box-shadow: var(--f-focus-box-shadow);
}
</style>
