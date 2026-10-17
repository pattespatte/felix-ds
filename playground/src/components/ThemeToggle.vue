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
            <span class="theme-toggle__label">
                <span class="theme-toggle__label--full">FKUI grundtema</span>
                <span class="theme-toggle__label--short">FKUI</span>
            </span>
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
            <span class="theme-toggle__label">
                <span class="theme-toggle__label--full">felix-tema</span>
                <span class="theme-toggle__label--short">felix</span>
            </span>
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
    // The variables are set on the header root (main.scss) and shrink with
    // the scrolled header band; the block padding has to shrink with the
    // height, or the 24px text line keeps the label taller than the height
    // variable asks for.
    min-height: var(--header-control-height, 2.5rem);
    padding: var(--header-control-pad-block, 0.25rem) 1rem;
    border-radius: 999px;
    color: var(--fkds-color-header-text-primary, inherit);
    white-space: nowrap;
}

// On portrait phones even the controls' own header row is too narrow for the
// full names (the row needs ~330px plus the header's own padding). Below
// 416px the distinctive parts of the names stand in; both variants contain
// the other, so the visible label keeps matching the accessible name
// (WCAG 2.5.3) whichever one is displayed.
.theme-toggle__label--short {
    display: none;
}

@media (max-width: 25.99em) {
    .theme-toggle__label--full {
        display: none;
    }

    .theme-toggle__label--short {
        display: inline;
    }
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
