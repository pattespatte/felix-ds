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
    <div ref="root" class="search-box">
        <div
            class="search-box__field"
            @keydown="handleKeydown"
            @focusin="handleFocus"
            @focusout="handleBlur"
        >
            <f-search-text-field
                v-model="searchQuery"
                placeholder="Sök komponent…"
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
                    <f-icon name="search" aria-hidden="true" />
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
/* Positioning context for the absolutely-positioned dropdown. Flex-basis
   instead of a fixed width: the header's right slot is narrow (the title
   side takes the flex space), so the box shrinks between the title and the
   toggles and only wraps below FKUI medium. */
.search-box {
    position: relative;
    flex: 0 1 14rem;
    min-width: 9rem;
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
