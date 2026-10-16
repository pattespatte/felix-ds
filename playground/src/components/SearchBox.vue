<script setup lang="ts">
// Header search box over the client-side index: FSearchTextField carries the
// label, the native look and the clear button; the live dropdown is mounted
// below it. ARIA combobox wiring rides on $attrs – FSearchTextField and
// FTextField both forward attrs onto the native <input>.
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { FIcon, FSearchTextField } from "@fkui/vue";
import { useSearch, type SearchResult } from "../composables/useSearch";
import SearchResults from "./SearchResults.vue";

// Single instance in the shell – a static id is the input's aria-controls
// target and the option-id prefix for aria-activedescendant.
const LISTBOX_ID = "playground-search-listbox";

const {
    searchQuery,
    searchResults,
    isLoading,
    hasResults,
    navigateToResult,
    clearSearch,
    loadSearchIndex,
} = useSearch();

const root = ref<HTMLElement | null>(null);
const searchResultsComponent = ref<InstanceType<typeof SearchResults> | null>(null);
const isFocused = ref(false);
const selectedIndex = ref(0);

// The dropdown is teleported to the layout header root. FKUI's .page-header
// has overflow: hidden, which clips the list at the header's bottom edge
// (it looked like it folded out behind #layout-navigation__primary); the
// sticky header root neither clips nor stacks below anything relevant
// (z-index 9995, above panel and main) and scrolls together with the
// input, so header-relative coordinates are stable without scroll listeners.
const teleportTarget = ref<string | HTMLElement>("body");
const dropdownStyle = ref({ left: "0px", top: "0px", width: "0px" });

function positionDropdown(): void {
    const header = document.querySelector(".layout-application-template__header");
    const input = root.value?.querySelector("input");
    if (!header || !input) {
        return;
    }
    const headerRect = header.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    dropdownStyle.value = {
        left: `${Math.round(inputRect.left - headerRect.left)}px`,
        top: `${Math.round(inputRect.bottom - headerRect.top + 4)}px`,
        width: `${Math.round(inputRect.width)}px`,
    };
}

// Show the live dropdown only while the field has focus and a query – the
// header must not float a stale list over the page after tabbing away.
const showDropdown = computed(() => isFocused.value && searchQuery.value.trim().length > 0);

watch(showDropdown, (open) => {
    if (open) {
        void nextTick(positionDropdown);
    }
});

// The expand transition resizes the field after the dropdown has opened
// (typing can start before the 0.2s flex-basis transition ends) – re-measure
// when the box reaches its focused width.
function onTransitionEnd(event: TransitionEvent): void {
    if (event.target === root.value && event.propertyName === "flex-basis") {
        positionDropdown();
    }
}

function handleFocus(): void {
    isFocused.value = true;
    // Fetch the index on first focus so results are ready while the visitor
    // types; useSearch loads it lazily and retries on failure.
    loadSearchIndex();
}

function handleBlur(): void {
    // Delay so a mousedown on a result still registers before the list hides.
    setTimeout(() => {
        isFocused.value = false;
    }, 150);
}

function handleResultSelect(result: SearchResult | null): void {
    if (result) {
        navigateToResult(result);
    } else {
        clearSearch();
    }
}

function handleKeydown(event: KeyboardEvent): void {
    if (showDropdown.value) {
        searchResultsComponent.value?.handleKeydown(event);
    }
}

// Close the dropdown on outside clicks (complements the blur delay for
// clicks that never focus another focusable element). The teleported
// dropdown lives outside this component's subtree, so clicks inside it
// must count as "inside" too.
function handleClickOutside(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Element)) {
        return;
    }
    if (root.value?.contains(target) || target.closest(".search-results")) {
        return;
    }
    isFocused.value = false;
}

onMounted(() => {
    const header = document.querySelector(".layout-application-template__header");
    if (header) {
        teleportTarget.value = header;
    }
    root.value?.addEventListener("transitionend", onTransitionEnd);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", positionDropdown);
});
onUnmounted(() => {
    root.value?.removeEventListener("transitionend", onTransitionEnd);
    document.removeEventListener("mousedown", handleClickOutside);
    window.removeEventListener("resize", positionDropdown);
});
</script>

<template>
    <div ref="root" class="search-box" :class="{ 'search-box--focused': isFocused }">
        <div
            class="search-box__field"
            @keydown="handleKeydown"
            @focusin="handleFocus"
            @focusout="handleBlur"
        >
            <f-search-text-field
                v-model="searchQuery"
                placeholder="Sök..."
                role="combobox"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                :aria-expanded="showDropdown && hasResults"
                :aria-controls="showDropdown && hasResults ? LISTBOX_ID : undefined"
                :aria-activedescendant="
                    showDropdown && hasResults ? `${LISTBOX_ID}-${selectedIndex}` : undefined
                "
            >
                Sök i playgrounden
                <template #input-left>
                    <f-icon name="search" class="search-box__magnifier" aria-hidden="true" />
                </template>
            </f-search-text-field>
        </div>

        <teleport :to="teleportTarget">
            <search-results
                v-if="searchQuery"
                ref="searchResultsComponent"
                v-model:selected-index="selectedIndex"
                :show-results="showDropdown"
                :search-results="searchResults"
                :search-query="searchQuery"
                :is-loading="isLoading"
                :has-results="hasResults"
                :listbox-id="LISTBOX_ID"
                :style="dropdownStyle"
                @result-select="handleResultSelect"
            />
        </teleport>
    </div>
</template>

<style scoped lang="scss">
/* Positioning context for the absolutely-positioned dropdown. Compact by
   default and wider while the field has focus (flex-basis transitions
   smoothly where motion is allowed); the header's right slot is narrow, so
   the collapsed size keeps search, theme pill and mode button on one row. */
.search-box {
    position: relative;
    flex: 0 1 10rem;
    min-width: 7.5rem;
}

@media (min-width: 40em) {
    .search-box--focused {
        /* 14rem is the widest the right header slot fits next to the theme
           pill and mode button without wrapping (slot ≈ 560px at 1280). */
        flex-basis: 14rem;
    }
}

@media (prefers-reduced-motion: no-preference) {
    .search-box {
        transition: flex-basis 0.2s ease;
    }
}

/* Below FKUI medium the header wraps; the search field takes its own full
   row above the toggles (same breakpoint as the header rules in
   main.scss). */
@media (max-width: 39.99em) {
    .search-box {
        flex: 1 1 100%;
        min-width: 0;
    }
}

.search-box__field :deep(.text-field) {
    width: 100%;
    margin-bottom: 0;
}

/* The input-left slot lands beside the input inside the wrapper, i.e.
   visually OUTSIDE the input's own border – pin the magnifier over the
   field instead and give the input a matching left padding. */
.search-box__field :deep(.text-field__input-wrapper) {
    position: relative;
}

.search-box__field :deep(.search-box__magnifier) {
    position: absolute;
    top: 50%;
    left: 0.625rem;
    transform: translateY(-50%);
    /* Keep the icon above FKUI's positioned .text-field__icon-wrapper (the
       input's parent) and its opaque input background. */
    z-index: 1;
    /* The icon inherits .page-header's white header text color, which is
       invisible over the input's white background – use the input's text
       color instead. */
    color: var(--fkds-color-text-primary, #1b1e23);
    pointer-events: none;
}

.search-box__field :deep(.text-field__input) {
    padding-left: 2.25rem;
}

/* Header variant: the visible label is replaced by the placeholder; the
   label itself stays in the accessibility tree (sr-only clip pattern –
   FKUI ships no label-class prop for FTextField). */
.search-box__field :deep(label.label) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>
