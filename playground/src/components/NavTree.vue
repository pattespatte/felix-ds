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
                <span class="nav-tree__toggle-label">{{ view.title }}</span>
                <span
                    class="nav-tree__chevron"
                    :class="{ 'nav-tree__chevron--open': isExpanded(view.slug) }"
                >
                    <f-icon name="caret-down" />
                </span>
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
// Structure follows the reference site's left menu (full-width rows, hairline
// separators between categories, fill on hover, rounded chevron chip on the
// row's far end, inset bar on the current link); colours stay on theme tokens
// so the two themes keep their own palettes.
.nav-tree,
.nav-tree__group {
    margin: 0;
    padding: 0;
    list-style: none;
}

.nav-tree__view + .nav-tree__view {
    border-top: 1px solid var(--fkds-color-border-weak, #d7d9e0);
}

.nav-tree__toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    padding: 1rem;
    border: 0;
    background: none;
    font: inherit;
    font-weight: var(--f-font-weight-bold, 600);
    color: var(--fkds-color-text-primary, #1b1e23);
    text-align: left;
    cursor: pointer;
}

.nav-tree__toggle:hover {
    background-color: var(--fkds-color-navigation-background-hover, #dbe9e2);
}

.nav-tree__toggle:focus-visible {
    outline: none;
    box-shadow: var(--f-focus-box-shadow);
}

// Rounded expand chip at the row's far end – the only marker besides the bold
// current link. Collapsed: light surface, chevron pointing down; expanded:
// dark surface, light chevron rotated to point up. On hover the chip blends
// into the row fill (same token) – the reference behaves the same.
.nav-tree__chevron {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.375rem;
    font-size: 1rem;
    background-color: var(--fkds-color-navigation-background-hover, #dbe9e2);
    color: var(--fkds-color-text-primary, #1b1e23);
}

.nav-tree__chevron .icon {
    transition: transform var(--f-animation-duration-fast, 150ms) ease-out;
}

.nav-tree__chevron--open {
    background-color: var(--fkds-color-navigation-background-selected, #1b1e23);
    color: var(--fkds-color-text-inverted, #ffffff);
}

.nav-tree__chevron--open .icon {
    transform: rotate(180deg);
}

.nav-tree__toggle-label {
    // Keep labels on one line; the panel scrolls if a title is longer than
    // the column.
    white-space: nowrap;
}

// Sub-level guide bar, growing one step deeper per nesting level in the
// reference; the tree is two levels, so a single fixed-width bar is enough.
.nav-tree__group {
    border-left: 12px solid var(--fkds-color-navigation-background-hover, #dbe9e2);
}

.nav-tree__link {
    display: block;
    padding: 0.375rem 1rem;
    color: var(--fkds-color-text-primary, #1b1e23);
    // The felix theme underlines content anchors globally; the reference
    // menu keeps its items plain, so the base style is pinned here.
    text-decoration: none;
}

.nav-tree__link:hover {
    background-color: var(--fkds-color-navigation-background-hover, #dbe9e2);
    text-decoration: none;
}

.nav-tree__link:focus-visible {
    outline: none;
    box-shadow: var(--f-focus-box-shadow);
}

.nav-tree__link[aria-current="page"] {
    font-weight: var(--f-font-weight-bold, 600);
    box-shadow: inset 4px 0 0 var(--fkds-color-text-primary, #1b1e23);
}

.nav-tree__link[aria-current="page"]:focus-visible {
    box-shadow:
        var(--f-focus-box-shadow),
        inset 4px 0 0 var(--fkds-color-text-primary, #1b1e23);
}
</style>
