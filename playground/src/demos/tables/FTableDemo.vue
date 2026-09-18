<script setup lang="ts">
import {
    FSortFilterDataset,
    FTable,
    defineTableColumns,
    useDatasetRef,
} from "@fkui/vue";

interface FruitRow {
    namn: string;
    ursprung: string;
    pris: string;
}

const data: FruitRow[] = [
    { namn: "Apelsin", ursprung: "Spanien", pris: "30" },
    { namn: "Banan", ursprung: "Ecuador", pris: "15" },
    { namn: "Kiwi", ursprung: "Nya Zeeland", pris: "45" },
    { namn: "Päron", ursprung: "Sverige", pris: "28" },
    { namn: "Äpple", ursprung: "Sverige", pris: "22" },
];

const rows = useDatasetRef(data);

const columns = defineTableColumns<FruitRow>([
    { type: "text", header: "Frukt", key: "namn" },
    { type: "text", header: "Ursprung", key: "ursprung" },
    { type: "text:currency", header: "Pris per kilo", key: "pris" },
]);

const sortableAttributes = { namn: "Frukt" };
</script>

<template>
    <section id="ftable" aria-labelledby="ftable-heading" class="demo">
        <h2 id="ftable-heading">FTable</h2>
        <p class="demo__description">
            Tabell med kolumndefinitioner via defineTableColumns –
            kolumntyperna text och valuta – och sortering på kolumnen Frukt
            genom FSortFilterDataset.
        </p>
        <f-sort-filter-dataset :data="rows" :sortable-attributes>
            <template #default="{ sortFilterResult }">
                <f-table :rows="sortFilterResult" :columns>
                    <template #caption> Frukt och ursprung </template>
                </f-table>
            </template>
        </f-sort-filter-dataset>
    </section>
</template>
