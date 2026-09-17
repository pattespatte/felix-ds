<template>
    <!-- Root is a div: the footer landmark comes from
         FLayoutApplicationTemplate's footer slot wrapper. -->
    <div class="page-footer">
        <div class="page-footer__inner">
            <div class="page-footer__brand">
                <p class="page-footer__title">felix-ds</p>
                <p class="page-footer__tagline">
                    Ett tunt temalager ovanpå FKUI:s publika npm-paket.
                </p>
            </div>
            <nav class="page-footer__group" aria-label="Sidfotsnavigation">
                <h2 class="page-footer__heading">Kategorier</h2>
                <ul>
                    <li><a href="#/knappar">Knappar och ikoner</a></li>
                    <li><a href="#/formular">Formulär</a></li>
                    <li><a href="#/kalender">Datum och kalender</a></li>
                    <li><a href="#/filer">Filer</a></li>
                    <li><a href="#/ytor">Ytor och paneler</a></li>
                    <li><a href="#/modaler">Modaler och dialoger</a></li>
                    <li><a href="#/navigation">Navigation och layout</a></li>
                    <li><a href="#/tabeller">Tabeller och data</a></li>
                    <li><a href="#/aterkoppling">Återkoppling och status</a></li>
                    <li><a href="#/wizard">Stegvisa flöden</a></li>
                    <li><a href="#/css">Endast CSS</a></li>
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
            <p>felix-ds 0.1.0 – privat proof of concept. Koden publiceras inte.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
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

.page-footer__tagline {
    margin: 0.5rem 0 0;
    color: rgba(255, 255, 255, 0.85);
}

.page-footer__heading {
    margin: 0 0 0.75rem;
    font-size: var(--f-font-size-standard, 1rem);
    font-weight: var(--f-font-weight-bold, 600);
}

.page-footer__group ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.5rem;
}

.page-footer a,
.page-footer__top {
    color: var(--fkds-color-text-inverted, #ffffff);
    text-decoration: underline;
    text-underline-offset: 3px;
}

.page-footer a:hover,
.page-footer__top:hover {
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
    color: rgba(255, 255, 255, 0.85);
}

.page-footer__bottom p {
    margin: 0;
}
</style>
