<script setup lang="ts">
// Header search box over the client-side index: FSearchTextField carries the
// label, the native look and the clear button; the live dropdown is mounted
// below it. ARIA combobox wiring rides on $attrs – FSearchTextField and
// FTextField both forward attrs onto the native <input>.
import { computed, onMounted, onUnmounted, ref } from "vue";
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

// Show the live dropdown only while the field has focus and a query – the
// header must not float a stale list over the page after tabbing away.
const showDropdown = computed(() => isFocused.value && searchQuery.value.trim().length > 0);

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
// clicks that never focus another focusable element).
function handleClickOutside(event: MouseEvent): void {
    if (root.value && !root.value.contains(event.target as Node)) {
        isFocused.value = false;
    }
}

onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside);
});
onUnmounted(() => {
    document.removeEventListener("mousedown", handleClickOutside);
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
            @result-select="handleResultSelect"
        />
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
