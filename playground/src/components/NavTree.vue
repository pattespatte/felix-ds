<script setup lang="ts">
import { ref } from "vue";
import { FIcon } from "@fkui/vue";
import { views } from "../navigation";
import { currentRoute, navigate } from "../router";

// Explicit user toggles; a view without an entry follows the default rule
// "expanded while it is the active view".
const toggled = ref<Record<string, boolean>>({});

function isExpanded(slug: string): boolean {
    return slug in toggled.value ? toggled.value[slug] : currentRoute.value.slug === slug;
}

function toggle(slug: string): void {
    toggled.value[slug] = !isExpanded(slug);
}

function isCurrent(slug: string, anchor: string): boolean {
    return currentRoute.value.slug === slug && currentRoute.value.anchor === anchor;
}
</script>

<template>
    <ul class="nav-tree">
        <li v-for="view in views" :key="view.slug" class="nav-tree__view">
            <button
                class="nav-tree__toggle"
                type="button"
                :aria-expanded="isExpanded(view.slug)"
                :aria-controls="`nav-tree-group-${view.slug}`"
                @click="toggle(view.slug)"
            >
                <f-icon
                    class="nav-tree__chevron"
                    :class="{ 'nav-tree__chevron--open': isExpanded(view.slug) }"
                    name="arrow-right"
                />
                <span class="nav-tree__toggle-label">{{ view.title }}</span>
            </button>
            <ul
                v-show="isExpanded(view.slug)"
                :id="`nav-tree-group-${view.slug}`"
                class="nav-tree__group"
            >
                <li class="nav-tree__item">
                    <a
                        class="nav-tree__link"
                        :href="`#/${view.slug}`"
                        :aria-current="isCurrent(view.slug, '') ? 'page' : undefined"
                        @click.prevent="navigate(view.slug)"
                    >
                        Översikt
                    </a>
                </li>
                <li v-for="anchor in view.anchors" :key="anchor.id" class="nav-tree__item">
                    <a
                        class="nav-tree__link"
                        :href="`#/${view.slug}/${anchor.id}`"
                        :aria-current="isCurrent(view.slug, anchor.id) ? 'page' : undefined"
                        @click.prevent="navigate(view.slug, anchor.id)"
                    >
                        {{ anchor.title }}
                    </a>
                </li>
            </ul>
        </li>
    </ul>
</template>

<style scoped lang="scss">
// Structure (two levels, ~25 px indent step, chevron left of the label) and
// colours follow the profile tokens – no values are taken from the reference
// image itself.
.nav-tree,
.nav-tree__group {
    margin: 0;
    padding: 0;
    list-style: none;
}

.nav-tree__view {
    margin-bottom: 0.25rem;
}

.nav-tree__toggle {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    width: 100%;
    padding: 0.375rem 0.25rem;
    border: 0;
    border-radius: var(--f-border-radius-medium, 4px);
    background: none;
    font: inherit;
    color: var(--fkds-color-text-primary, #1b1e23);
    text-align: left;
    cursor: pointer;
}

.nav-tree__toggle:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
}

.nav-tree__toggle:focus-visible {
    outline: none;
    box-shadow: var(--f-focus-box-shadow);
}

// Muted expand indicator, rotated open – the only marker besides the bold
// current link (no accent colours in the nav).
.nav-tree__chevron {
    flex: none;
    font-size: 0.75rem;
    color: var(--fkds-color-text-secondary, #6e7689);
    transition: transform var(--f-animation-duration-fast, 150ms) ease-out;
}

.nav-tree__chevron--open {
    transform: rotate(90deg);
}

.nav-tree__toggle-label {
    // Keep labels on one line; the panel scrolls if a title is longer than
    // the column.
    white-space: nowrap;
}

.nav-tree__item {
    padding-left: 25px;
}

.nav-tree__link {
    display: inline-block;
    padding: 0.25rem 0.25rem 0.25rem 0.5rem;
    border-radius: var(--f-border-radius-medium, 4px);
    color: var(--fkds-color-text-primary, #1b1e23);
}

.nav-tree__link:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
}

.nav-tree__link:focus-visible {
    outline: none;
    box-shadow: var(--f-focus-box-shadow);
}

.nav-tree__link[aria-current="page"] {
    font-weight: var(--f-font-weight-bold, 600);
}
</style>
