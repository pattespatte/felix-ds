<script setup lang="ts">
import { computed } from "vue";
import { currentColorMode, toggleColorMode } from "../theme";

const isDark = computed(() => currentColorMode.value === "dark");
const label = computed(() =>
    isDark.value ? "Växla till ljust läge" : "Växla till mörkt läge",
);
</script>

<template>
    <!-- Hand-drawn glyphs: the default icon library ships no sun/moon. The
         visible icon shows the mode a click would leave (sun while light). -->
    <button
        type="button"
        class="color-mode-toggle"
        :aria-label="label"
        :title="label"
        @click="toggleColorMode()"
    >
        <svg
            v-if="isDark"
            class="color-mode-toggle__icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path
                d="M20.6 14.4A8.9 8.9 0 1 1 9.6 3.4a7.2 7.2 0 0 0 11 11z"
                fill="currentColor"
            />
        </svg>
        <svg
            v-else
            class="color-mode-toggle__icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="12" y1="2.5" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="21.5" />
                <line x1="2.5" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="21.5" y2="12" />
                <line x1="5.3" y1="5.3" x2="7" y2="7" />
                <line x1="17" y1="17" x2="18.7" y2="18.7" />
                <line x1="5.3" y1="18.7" x2="7" y2="17" />
                <line x1="17" y1="7" x2="18.7" y2="5.3" />
            </g>
        </svg>
    </button>
</template>

<style scoped lang="scss">
.color-mode-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    border: 1px solid var(--fkds-color-header-text-primary, currentColor);
    border-radius: 999px;
    background: transparent;
    color: var(--fkds-color-header-text-primary, inherit);
    cursor: pointer;
}

// Same hover pairing as the theme pill: the hover surface token is pale in
// both modes while the header text is white in the grundtema, so the label
// switches to the primary text colour on hover to keep AA contrast.
.color-mode-toggle:hover {
    background: var(--fkds-color-navigation-background-hover, rgba(0, 0, 0, 0.2));
    color: var(--fkds-color-text-primary, #1b1e23);
}

.color-mode-toggle:focus-visible {
    outline: none;
    box-shadow: var(--f-focus-box-shadow);
}

.color-mode-toggle__icon {
    width: 1.25rem;
    height: 1.25rem;
}
</style>
