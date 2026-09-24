<template>
    <!-- Root is a div: the footer landmark comes from
         FLayoutApplicationTemplate's footer slot wrapper. -->
    <div class="page-footer">
        <div class="page-footer__inner">
            <div class="page-footer__brand">
                <p class="page-footer__title">
                    <a class="page-footer__home" href="#/start">felix-ds</a>
                </p>
                <p class="page-footer__tagline">
                    Ett tunt temalager ovanpå FKUI:s publika npm-paket.
                </p>
            </div>
            <nav
                class="page-footer__group page-footer__group--categories"
                aria-label="Sidfotsnavigation"
            >
                <h2 class="page-footer__heading">Kategorier</h2>
                <ul>
                    <li v-for="view in views" :key="view.slug">
                        <a :href="`#/${view.slug}`">{{ view.title }}</a>
                    </li>
                </ul>
            </nav>
            <div class="page-footer__group">
                <h2 class="page-footer__heading">Genvägar</h2>
                <ul>
                    <li>
                        <button class="page-footer__top" type="button" @click="scrollToTop">
                            Till sidans topp
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <div class="page-footer__bottom">
            <p>
                felix-ds 0.1.0 – privat proof of concept.
                <a href="https://github.com/pattespatte/felix-ds">Öppen källkod på GitHub</a>.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { views } from "../navigation";

function scrollToTop(): void {
    window.scrollTo({ top: 0 });
}
</script>

<style scoped lang="scss">
.page-footer {
    background-color: var(--fkds-color-action-background-primary-default, #232948);
    color: var(--fkds-color-text-inverted, #ffffff);
    padding: 4rem 1rem 2rem;
}

// Grundtema (html without .theme-felix): the footer takes the reference
// site's green surface with a darker green top border. Neither green is an
// FKUI token, so the raw values stand in here: #316942 body fill and
// #0c4329 border, taken from the reference footer (2026-09-24). The fill is
// dark in both color modes, but upstream dark flips --fkds-color-text-
// inverted to dark ink (it expects a light surface) – pin it back to white.
html:not(.theme-felix) .page-footer {
    --fkds-color-text-inverted: #ffffff;
    background-color: #316942;
    border-top: 0.5rem solid #0c4329;
}

.page-footer__inner {
    max-width: 72rem;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 3rem 4rem;
}

.page-footer__brand {
    max-width: 22rem;
}

.page-footer__title {
    margin: 0;
    font-size: var(--f-font-size-h3, 1.25rem);
    font-weight: var(--f-font-weight-bold, 600);
}

// Logo-style home link: plain until hovered, unlike the underlined footer
// anchors. :root lifts these rules one class-step – the theme emits its
// anchor colours under the combined dark scope as
// html.theme-felix[data-color-mode=dark] a (0,2,2), which out-specifies a
// plain scoped rule (0,2,1) and would paint the profile link blue on the
// footer's inverted fill – and the type selector on the anchor rules below
// out-ranks a bare class, so the home link restates it.
:root .page-footer a.page-footer__home {
    text-decoration: none;
}

:root .page-footer a.page-footer__home:hover,
:root .page-footer a.page-footer__home:focus-visible {
    text-decoration: underline;
}

.page-footer__tagline {
    margin: 0.5rem 0 0;
    // Full opacity: at 0.85 the white drops to 4.14:1 on the felix dark
    // footer fill (#4c6ac4) – just under the AA threshold.
    color: var(--fkds-color-text-inverted, #ffffff);
}

.page-footer__heading {
    margin: 0 0 0.75rem;
    font-size: var(--f-font-size-h3, 1.25rem);
    font-weight: var(--f-font-weight-bold, 600);
}

.page-footer__group ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.5rem;
}

// The category list spreads over two columns so the footer fills the width
// instead of stacking twelve links in one tall column.
.page-footer__group--categories ul {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 2rem;
}

// :root lifts these rules one class-step: the theme emits its anchor colours
// under the combined dark scope as
// html.theme-felix[data-color-mode=dark] a (0,2,2), which out-specifies a
// plain scoped .page-footer a (0,2,1) and would paint the profile link blue
// on the footer's inverted fill.
:root .page-footer a,
:root .page-footer__top {
    color: var(--fkds-color-text-inverted, #ffffff);
    text-decoration: underline;
    text-underline-offset: 3px;
}

:root .page-footer a:hover,
:root .page-footer__top:hover {
    color: var(--fkds-color-text-inverted, #ffffff);
    text-decoration: none;
}

// Reads as a link (same treatment as the anchors above), stays a button so it
// can scroll without touching the route hash.
.page-footer__top {
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    cursor: pointer;
}

.page-footer__bottom {
    max-width: 72rem;
    margin: 2rem auto 0;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    font-size: 0.875rem;
    // Full opacity – see the tagline note above.
    color: var(--fkds-color-text-inverted, #ffffff);
}

.page-footer__bottom p {
    margin: 0;
}
</style>
