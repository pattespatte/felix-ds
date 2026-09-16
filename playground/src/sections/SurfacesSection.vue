<script setup lang="ts">
import { ref } from "vue";
import {
    FButton,
    FCard,
    FDefinitionList,
    FExpandablePanel,
    FModal,
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
    { namn: "Äpple", ursprung: "Sverige", pris: "22" },
];

const rows = useDatasetRef(data);

const columns = defineTableColumns<FruitRow>([
    { type: "text", header: "Frukt", key: "namn" },
    { type: "text", header: "Ursprung", key: "ursprung" },
    { type: "text:currency", header: "Pris per kilo", key: "pris" },
]);

const definitions = [
    { term: "Version", definition: "0.1.0 (proof of concept)" },
    { term: "Temamodell", definition: "CSS-variabler ovanpå FKUI:s npm-paket" },
    { term: "Typografi", definition: "Noto Sans (text), Roboto Slab (rubriker)" },
];

const modalOpen = ref(false);

function openModal(): void {
    modalOpen.value = true;
}

function closeModal(): void {
    modalOpen.value = false;
}
</script>

<template>
    <section id="surfaces" aria-labelledby="surfaces-heading">
        <h2 id="surfaces-heading">Ytor och data</h2>

        <h3>Kort</h3>
        <f-card>
            <template #header="{ headingSlotClass }">
                <h4 :class="headingSlotClass">Temakort</h4>
            </template>
            <template #default>
                Ett kort visar sammanhängande information med rubrik, innehåll
                och ofta en sidfot med åtgärder.
            </template>
            <template #footer>
                <f-button size="medium" variant="primary" @click="openModal">
                    Öppna modal
                </f-button>
            </template>
        </f-card>

        <h3>Modal</h3>
        <p>Modalen öppnas från knapparna på kortet ovan.</p>

        <h3>Expanderbar panel</h3>
        <f-expandable-panel>
            <template #title> Om temalagret </template>
            <template #default>
                Temat omdefinierar designvariabler som färger, typografi,
                linjetjocklekar och radier. Inga komponenter är omslutna eller
                omskrivna.
            </template>
        </f-expandable-panel>

        <h3>Tabell</h3>
        <f-table :rows :columns>
            <template #caption> Frukt och ursprung </template>
        </f-table>

        <h3>Definitionslista</h3>
        <f-definition-list :definitions />

        <f-modal :is-open="modalOpen" @close="closeModal">
            <template #header> Bekräfta </template>
            <template #content>
                Detta är en modal som följer det aktiva temat.
            </template>
            <template #footer>
                <div class="button-group">
                    <f-button
                        class="button-group__item"
                        size="medium"
                        variant="primary"
                        @click="closeModal"
                    >
                        Stäng
                    </f-button>
                </div>
            </template>
        </f-modal>
    </section>
</template>

<style scoped lang="scss">
h3 {
    margin-top: 2rem;
}
</style>
