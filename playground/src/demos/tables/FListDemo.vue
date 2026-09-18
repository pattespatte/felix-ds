<script setup lang="ts">
import { computed, ref } from "vue";
import { FList } from "@fkui/vue";

interface DocumentItem {
    id: string;
    namn: string;
    typ: string;
}

const documents: DocumentItem[] = [
    { id: "1", namn: "Årsredovisning", typ: "PDF" },
    { id: "2", namn: "Policy för informationssäkerhet", typ: "PDF" },
    { id: "3", namn: "Kvalitetsplan", typ: "PDF" },
    { id: "4", namn: "Ritningar plan 2", typ: "DWG" },
    { id: "5", namn: "Driftsinstruktion", typ: "DOCX" },
];

const valda = ref<DocumentItem[]>([]);

const statusText = computed(() =>
    valda.value.length === 0
        ? "Inga dokument markerade."
        : `Markerade: ${valda.value.map((d) => d.namn).join(", ")}.`,
);
</script>

<template>
    <section id="flist" aria-labelledby="flist-heading" class="demo">
        <h2 id="flist-heading">FList</h2>
        <p class="demo__description">
            Lista med kryssruteval – markera dokumenten du vill hämta.
        </p>
        <f-list v-model="valda" key-attribute="id" :items="documents" selectable>
            <template #default="{ item }">
                {{ item.namn }} ({{ item.typ }})
            </template>
            <template #screenreader="{ item }"> Dokumentet {{ item.namn }} </template>
        </f-list>
        <p aria-live="polite">{{ statusText }}</p>
    </section>
</template>
