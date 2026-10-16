// Client-side search over the generated search-index.json (built by
// scripts/search-index.ts). The index is fetched lazily on the first
// search-box focus – most visitors never search, and the ~48 KB should not
// sit at the back of every initial waterfall. Matches are scored
// title > component names > content > keywords and capped at 8 rows.
import { computed, ref, watch } from "vue";
import { navigate } from "../router";

/** Entry shape in search-index.json (the generator's contract). */
export interface SearchIndexItem {
    id: string;
    slug: string;
    anchor: string;
    title: string;
    url: string;
    viewTitle: string;
    names: string[];
    content: string;
    keywords: string[];
}

export interface SearchResult extends SearchIndexItem {
    score: number;
    snippet: string;
}

export function useSearch() {
    const searchQuery = ref("");
    const searchResults = ref<SearchResult[]>([]);
    const isLoading = ref(false);
    const searchIndex = ref<SearchIndexItem[]>([]);
    const isIndexLoaded = ref(false);

    // Single-flight promise: concurrent focus events share one fetch, and a
    // failed fetch must stay retryable on the next focus.
    let indexLoad: Promise<void> | null = null;

    const loadSearchIndex = (): Promise<void> => {
        if (!indexLoad) {
            indexLoad = fetchSearchIndex().finally(() => {
                if (!isIndexLoaded.value) {
                    indexLoad = null;
                }
            });
        }
        return indexLoad.then(() => {
            // A query typed while the index was still loading left the
            // dropdown empty (performSearch early-exits without the index) –
            // re-run it now that the index is available.
            if (isIndexLoaded.value && searchQuery.value.trim()) {
                performSearch(searchQuery.value);
            }
        });
    };

    async function fetchSearchIndex(): Promise<void> {
        try {
            isLoading.value = true;
            // Relative to BASE_URL: hash routing never changes the document
            // path, so this resolves the same in dev and on GitHub Pages.
            const response = await fetch(`${import.meta.env.BASE_URL}search-index.json`);
            if (!response.ok) {
                throw new Error(`Failed to load search index (${response.status})`);
            }
            searchIndex.value = (await response.json()) as SearchIndexItem[];
            isIndexLoaded.value = true;
        } catch (error) {
            console.error("Error loading search index:", error);
        } finally {
            isLoading.value = false;
        }
    }

    function calculateScore(item: SearchIndexItem, query: string): number {
        const titleLower = item.title.toLowerCase();
        const contentLower = item.content.toLowerCase();

        let score = 0;
        let matched = false;

        // Title matches are most important
        if (titleLower.includes(query)) {
            score += 10;
            matched = true;
        }
        if (titleLower === query) {
            score += 20;
        }

        // Component names are the second-strongest signal: "ftextfield"
        // should find "Textfält" even though the title never spells it.
        if (item.names.some((name) => name.toLowerCase().includes(query))) {
            score += 8;
            matched = true;
        }

        // Content matches
        if (contentLower.includes(query)) {
            score += 3;
            matched = true;
        }

        // Keyword matches
        for (const word of query.split(/\s+/)) {
            if (item.keywords.includes(word)) {
                score += 2;
                matched = true;
            }
        }

        // The short-title boost only orders real matches (likely more
        // specific) – on its own it must never surface a non-match, or a
        // nonsense query would return eight arbitrary rows.
        if (!matched) {
            return 0;
        }
        score += Math.max(0, 5 - item.title.length / 10);

        return score;
    }

    function generateSnippet(content: string, query: string, maxLength = 150): string {
        const index = content.toLowerCase().indexOf(query);
        if (index === -1) {
            return content.substring(0, maxLength) + (content.length > maxLength ? "..." : "");
        }

        const start = Math.max(0, index - 50);
        const end = Math.min(content.length, index + query.length + 100);
        let snippet = content.substring(start, end);
        if (start > 0) {
            snippet = `...${snippet}`;
        }
        if (end < content.length) {
            snippet = `${snippet}...`;
        }
        return snippet;
    }

    let searchTimeout: ReturnType<typeof setTimeout> | null = null;

    function performSearch(query: string): void {
        if (!query.trim() || !isIndexLoaded.value) {
            searchResults.value = [];
            return;
        }

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Debounce so fast typing does not score every keystroke.
        searchTimeout = setTimeout(() => {
            const queryLower = query.toLowerCase().trim();
            if (queryLower.length < 2) {
                searchResults.value = [];
                return;
            }

            const results: SearchResult[] = [];
            for (const item of searchIndex.value) {
                const score = calculateScore(item, queryLower);
                if (score > 0) {
                    results.push({
                        ...item,
                        score,
                        snippet: generateSnippet(item.content, queryLower),
                    });
                }
            }

            searchResults.value = results
                .sort((a, b) => b.score - a.score)
                .slice(0, 8);
        }, 300);
    }

    function navigateToResult(result: SearchResult): void {
        navigate(result.slug, result.anchor);
        searchResults.value = [];
        searchQuery.value = "";
    }

    function clearSearch(): void {
        searchQuery.value = "";
        searchResults.value = [];
    }

    watch(searchQuery, (newQuery) => {
        performSearch(newQuery);
    });

    const hasResults = computed(() => searchResults.value.length > 0);

    return {
        searchQuery,
        searchResults,
        isLoading,
        isIndexLoaded,
        hasResults,
        performSearch,
        navigateToResult,
        clearSearch,
        loadSearchIndex,
    };
}
