<script setup lang="ts">
// Presentational dropdown for the header search box. All state arrives as
// props; the selected row is a v-model so the parent can bind the input's
// aria-activedescendant, and the keyboard contract is exposed as a method
// the parent invokes from its own keydown listener (focus never leaves the
// input – the ARIA 1.2 combobox pattern).
import { watch } from "vue";
import type { SearchResult } from "../composables/useSearch";

interface Props {
    showResults: boolean;
    searchResults: SearchResult[];
    searchQuery: string;
    isLoading: boolean;
    hasResults: boolean;
    /** Id of the listbox element – the input's aria-controls target. */
    listboxId: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    "result-select": [result: SearchResult | null];
}>();

const selectedIndex = defineModel<number>("selectedIndex", { default: 0 });

watch(
    () => props.searchResults,
    () => {
        selectedIndex.value = 0;
    },
);

function optionId(index: number): string {
    return `${props.listboxId}-${index}`;
}

function handleKeydown(event: KeyboardEvent): void {
    if (!props.showResults || !props.hasResults) {
        return;
    }

    switch (event.key) {
        case "ArrowDown":
            event.preventDefault();
            selectedIndex.value = (selectedIndex.value + 1) % props.searchResults.length;
            break;
        case "ArrowUp":
            event.preventDefault();
            selectedIndex.value =
                selectedIndex.value <= 0
                    ? props.searchResults.length - 1
                    : selectedIndex.value - 1;
            break;
        case "Enter":
            event.preventDefault();
            if (props.searchResults[selectedIndex.value]) {
                selectResult(props.searchResults[selectedIndex.value]);
            }
            break;
        case "Escape":
            event.preventDefault();
            emit("result-select", null);
            break;
    }
}

function selectResult(result: SearchResult): void {
    emit("result-select", result);
}

// Unmodified left click routes through selectResult (the parent clears the
// query and the dropdown); modifier and middle clicks fall through to the
// browser so the hash url opens in a new tab like any other link.
function onResultClick(event: MouseEvent, result: SearchResult): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
    }
    event.preventDefault();
    selectResult(result);
}

// Second line of a row: component names and the owning view, e.g.
// "FTextField · Formulär" (CSS patterns show only the view).
function metaLine(result: SearchResult): string {
    return result.names.length > 0
        ? `${result.names.join(", ")} · ${result.viewTitle}`
        : result.viewTitle;
}

// Highlight matching text. The text comes from the local search index
// (site content), never user input, and the query is regex-escaped.
function highlightText(text: string, query: string): string {
    if (!query.trim()) {
        return text;
    }
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
}

defineExpose({ handleKeydown });
</script>

<template>
    <div v-if="showResults" class="search-results">
        <div class="search-results__heading">Sökresultat</div>

        <div v-if="isLoading" class="search-results__state">Söker...</div>

        <div v-else-if="!hasResults" class="search-results__state">
            Inga sökresultat för ”{{ searchQuery }}”
        </div>

        <!-- The anchors ARE the options (a[href] may carry role=option):
             direct listbox children, tabindex=-1 so focus never leaves the
             combobox input, and real hrefs so modifier and middle clicks
             open the hash url in a new tab like any other link. -->
        <div v-else :id="listboxId" class="search-results__list" role="listbox" aria-label="Sökresultat" tabindex="-1">
            <a
                v-for="(result, index) in searchResults"
                :key="result.id"
                class="search-results__item"
                :class="{ 'search-results__item--active': selectedIndex === index }"
                role="option"
                tabindex="-1"
                :id="optionId(index)"
                :aria-selected="selectedIndex === index"
                :href="result.url"
                @mouseenter="selectedIndex = index"
                @click="onResultClick($event, result)"
            >
                <span
                    class="search-results__item-title"
                    v-html="highlightText(result.title, searchQuery)"
                />
                <span class="search-results__item-meta">{{ metaLine(result) }}</span>
                <span
                    v-if="result.snippet"
                    class="search-results__item-snippet"
                    v-html="highlightText(result.snippet, searchQuery)"
                />
            </a>
        </div>
    </div>
</template>

<style scoped lang="scss">
/* Absolute against the search box (position: relative on its root); the
   header's own z-index (9995) keeps the dropdown above panel and main. */
.search-results {
    position: absolute;
    z-index: 60;
    margin-top: 0.25rem;
    width: 100%;
    border: 1px solid var(--fkds-color-border-primary, #c4c6cd);
    border-radius: 0.25rem;
    background-color: var(--fkds-color-background-primary, #ffffff);
    box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
    text-align: left;
}

.search-results__heading {
    padding: 0.5rem 0.75rem 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--fkds-color-text-secondary, #54565c);
}

.search-results__state {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: var(--fkds-color-text-secondary, #54565c);
}

/* The listbox is the scroll container and carries tabindex=-1 (APG
   combobox pattern): keyboard focus stays on the input, but the region
   stays programmatically focusable for keyboard scroll access. */
.search-results__list {
    display: block;
    max-height: 24rem;
    padding: 0.25rem 0;
    overflow: auto;
}

.search-results__item:hover,
.search-results__item--active {
    background-color: var(--fkds-color-background-secondary, #f5f5f5);
}

/* The whole option is one link that fills the row (title, meta, snippet are
   all clickable) and inherits text colors instead of the global anchor look.
   The doubled class keeps the felix theme's global anchor rule (html-scoped,
   up to 0-2-1) from re-adding the profile's link treatment – same carve-out
   pattern as the nav tree, just one notch stronger. */
a.search-results__item.search-results__item {
    display: block;
    padding: 0.5rem 0.75rem;
    color: inherit;
    text-decoration: none;
}

a.search-results__item.search-results__item:focus-visible {
    outline: none;
    box-shadow: var(--f-focus-box-shadow);
}

.search-results__item-title {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--fkds-color-text-primary, #26262a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.search-results__item-meta {
    display: block;
    margin-top: 0.125rem;
    font-size: 0.75rem;
    color: var(--fkds-color-action-text-primary-default, #23638c);
}

.search-results__item-snippet {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: var(--fkds-color-text-secondary, #54565c);
    overflow: hidden;
}

.search-results :deep(mark) {
    background-color: var(--fkds-color-feedback-background-info, #e5f1f8);
    color: inherit;
}
</style>
