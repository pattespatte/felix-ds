<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { FPaginator } from "@fkui/vue";

const numberOfPages = 7;
const page = ref(1);
const root = ref<HTMLElement | null>(null);

function onPageEvent(event: Event): void {
    if (event.type === "paginateDataset:previous") {
        page.value = Math.max(1, page.value - 1);
    } else if (event.type === "paginateDataset:next") {
        page.value = Math.min(numberOfPages, page.value + 1);
    } else {
        page.value = (event as CustomEvent<{ page: number }>).detail.page;
    }
}

onMounted(() => {
    for (const type of [
        "paginateDataset:page",
        "paginateDataset:previous",
        "paginateDataset:next",
    ]) {
        root.value?.addEventListener(type, onPageEvent);
    }
});

onBeforeUnmount(() => {
    for (const type of [
        "paginateDataset:page",
        "paginateDataset:previous",
        "paginateDataset:next",
    ]) {
        root.value?.removeEventListener(type, onPageEvent);
    }
});
</script>

<template>
    <section id="fpaginator" aria-labelledby="fpaginator-heading" class="demo">
        <h2 id="fpaginator-heading">FPaginator</h2>
        <p class="demo__description">
            Pagineringen fristående – sidvalet styrs här av komponentens
            egna händelser utanför en datamängd.
        </p>
        <div ref="root">
            <!-- Distinct landmark name: the page also carries the paginator
                 inside FPaginateDatasetDemo, which uses the default label. -->
            <f-paginator
                :current-page="page"
                :number-of-pages="numberOfPages"
                navigator-label="Navigera mellan sidor i pagineringsexemplet"
            />
        </div>
        <p aria-live="polite">Vald sida: {{ page }} av {{ numberOfPages }}</p>
    </section>
</template>
