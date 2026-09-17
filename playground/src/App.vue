<script setup lang="ts">
import { FPageHeader } from "@fkui/vue";
import { applyTheme, currentTheme } from "./theme";
import ThemeToggle from "./components/ThemeToggle.vue";
import PageFooter from "./components/PageFooter.vue";
import ActionsSection from "./sections/ActionsSection.vue";
import FormsSection from "./sections/FormsSection.vue";
import SurfacesSection from "./sections/SurfacesSection.vue";
</script>

<template>
    <!-- FKUI:s sidhuvud renderas som en div utan landmärke; wrappern ger
         banner-landmärket (motsvarande footer-elementet nedan). -->
    <header>
        <f-page-header>
            felix-ds<span class="app-name-sub"> – playground</span>
            <template #right>
                <theme-toggle />
            </template>
        </f-page-header>
    </header>

    <main>
        <h1>Playground</h1>
        <p class="intro">
            Ett tunt temalager ovanpå FKUI:s publika npm-paket. Växla mellan
            <button class="intro__theme-toggle" type="button" :aria-pressed="currentTheme === 'fkui'" @click="applyTheme('fkui')">FKUI:s grundtema</button>
            och
            <button class="intro__theme-toggle" type="button" :aria-pressed="currentTheme === 'felix'" @click="applyTheme('felix')">felix-temat</button>.
            Alla komponenter byter utseende direkt, utan omladdning.
        </p>

        <nav class="section-nav" aria-label="Sektioner">
            <a href="#actions">Knappar och återkoppling</a>
            <a href="#forms">Formulär</a>
            <a href="#surfaces">Ytor och data</a>
        </nav>

        <actions-section />
        <forms-section />
        <surfaces-section />
    </main>

    <page-footer />
</template>

<style scoped lang="scss">
.app-name-sub {
    font-weight: var(--f-font-weight-normal, 400);
}

.intro {
    max-width: 46rem;
}

// Inline theme switches that read as links: same treatment as the theme's
// anchors (constant action colour, underline that disappears on hover).
// Native button focus-visible styling from FKUI applies as-is.
.intro__theme-toggle {
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    color: var(--fkds-color-action-text-primary-default);
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
}

.intro__theme-toggle:hover {
    color: var(--fkds-color-action-text-primary-hover);
    text-decoration: none;
}

.intro__theme-toggle[aria-pressed="true"] {
    font-weight: var(--f-font-weight-bold);
}

.section-nav {
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;
    padding: 0.75rem 0;
    margin-bottom: 1rem;
    border-block: 1px solid var(--fkds-color-border-weak);
}
</style>
