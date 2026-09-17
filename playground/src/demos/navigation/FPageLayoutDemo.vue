<script setup lang="ts">
import { FPageLayout } from "@fkui/vue";
</script>

<template>
    <section id="fpagelayout" aria-labelledby="fpagelayout-heading" class="demo">
        <h2 id="fpagelayout-heading">FPageLayout</h2>
        <p class="demo__description">
            Sidlayout med tre kolumner – sidhuvud, vänster och höger panel,
            innehåll och sidfot.
        </p>
        <f-page-layout layout="three-column" class="page-layout-demo">
            <template #default="{ header, left, right, content, footer }">
                <header :slot="header" class="page-layout-demo__band">Sidhuvud</header>
                <div :slot="left" class="page-layout-demo__panel">Vänsterpanel</div>
                <div :slot="right" class="page-layout-demo__panel">Högerpanel</div>
                <main :slot="content" class="page-layout-demo__content">Huvudinnehåll</main>
                <footer :slot="footer" class="page-layout-demo__band">Sidfot</footer>
            </template>
        </f-page-layout>
    </section>
</template>

<style scoped lang="scss">
.page-layout-demo {
    min-height: 18rem;
}

.page-layout-demo__band,
.page-layout-demo__panel,
.page-layout-demo__content {
    padding: 1rem;
}

.page-layout-demo__band {
    background-color: var(--fkds-color-background-secondary, #f7f8f8);
}

.page-layout-demo__panel {
    border: 1px solid var(--fkds-color-border-weak, #d7d9e0);
}

.page-layout-demo__content {
    display: grid;
    place-items: center;
    color: var(--fkds-color-text-secondary, #585f71);
}
</style>
