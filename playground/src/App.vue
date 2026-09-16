<script setup lang="ts">
import { FPageHeader } from "@fkui/vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import PageFooter from "./components/PageFooter.vue";
import ActionsSection from "./sections/ActionsSection.vue";
import FormsSection from "./sections/FormsSection.vue";
import SurfacesSection from "./sections/SurfacesSection.vue";
</script>

<template>
    <f-page-header>
        felix-ds<span class="app-name-sub"> – playground</span>
        <template #right>
            <theme-toggle />
        </template>
    </f-page-header>

    <main>
        <h1>Playground</h1>
        <p class="intro">
            Ett tunt temalager ovanpå FKUI:s publika npm-paket. Växla mellan
            FKUI:s grundtema och felix-temat med väljaren uppe till höger –
            alla komponenter byter utseende direkt, utan omladdning.
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

.section-nav {
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;
    padding: 0.75rem 0;
    margin-bottom: 1rem;
    border-block: 1px solid var(--fkds-color-border-weak);
}
</style>
