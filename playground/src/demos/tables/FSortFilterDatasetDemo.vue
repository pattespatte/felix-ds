<script setup lang="ts">
import { FList, FSortFilterDataset } from "@fkui/vue";

interface FruitItem {
    id: string;
    namn: string;
    ursprung: string;
    beskrivning: string;
}

const fruits: FruitItem[] = [
    {
        id: "1",
        namn: "Apelsin",
        ursprung: "Spanien",
        beskrivning: "Saftiga apelsiner för direkt konsumtion eller pressning.",
    },
    {
        id: "2",
        namn: "Banan",
        ursprung: "Ecuador",
        beskrivning: "Söta bananer, mogna för skeppning.",
    },
    {
        id: "3",
        namn: "Kiwi",
        ursprung: "Nya Zeeland",
        beskrivning: "Gröna kiwifrukter med syrlig smak.",
    },
    {
        id: "4",
        namn: "Päron",
        ursprung: "Sverige",
        beskrivning: "Fasta päron från svenska odlingar.",
    },
    {
        id: "5",
        namn: "Äpple",
        ursprung: "Sverige",
        beskrivning: "Krispiga äpplen av svensk sort.",
    },
];

const sortableAttributes = { namn: "Frukt", ursprung: "Ursprung" };
</script>

<template>
    <section id="fsortfilterdataset" aria-labelledby="fsortfilterdataset-heading" class="demo">
        <h2 id="fsortfilterdataset-heading">FSortFilterDataset</h2>
        <p class="demo__description">
            Sök- och sorteringsbar datamängd – fritextsökningen filtrerar och
            listan kan sorteras på Frukt eller Ursprung. Komponenten ger även
            tabellkomponenterna (t.ex. FTable) deras sorteringsstyrning.
        </p>
        <f-sort-filter-dataset :data="fruits" :sortable-attributes>
            <template #header="{ slotClass }">
                <h3 :class="slotClass">Frukter från olika länder</h3>
            </template>
            <template #default="{ sortFilterResult }">
                <f-list key-attribute="id" :items="sortFilterResult">
                    <template #default="{ item }">
                        <p>
                            {{ item.namn }} – {{ item.ursprung }}:
                            {{ item.beskrivning }}
                        </p>
                    </template>
                    <template #screenreader="{ item }"> {{ item.namn }} </template>
                </f-list>
            </template>
        </f-sort-filter-dataset>
    </section>
</template>
