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
// Structure follows the reference site's left menu (full-width rows, hairline
// separators between categories, fill on hover, inset bar on the current
// link); colours stay on theme tokens so the two themes keep their own
// palettes.
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
    gap: 0.375rem;
    width: 100%;
    padding: 0.625rem 1rem;
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

// Muted expand indicator, rotated open – the only marker besides the bold
// current link.
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
