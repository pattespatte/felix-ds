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
    <div class="view">
        <h1>Ytor och paneler</h1>
        <p class="view__intro">Ytor som samlar innehåll: kort, paneler och modal.</p>

        <section id="fcard" aria-labelledby="fcard-heading">
            <h2 id="fcard-heading">Kort</h2>
            <f-card>
                <template #header="{ headingSlotClass }">
                    <h3 :class="headingSlotClass">Temakort</h3>
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
        </section>

        <section id="fmodal" aria-labelledby="fmodal-heading">
            <h2 id="fmodal-heading">Modal</h2>
            <p>Modalen öppnas från knapparna på kortet ovan.</p>
        </section>

        <section id="fexpandablepanel" aria-labelledby="fexpandablepanel-heading">
            <h2 id="fexpandablepanel-heading">Expanderbar panel</h2>
            <f-expandable-panel>
                <template #title> Om temalagret </template>
                <template #default>
                    Temat omdefinierar designvariabler som färger, typografi,
                    linjetjocklekar och radier. Inga komponenter är omslutna eller
                    omskrivna.
                </template>
            </f-expandable-panel>
        </section>

        <section id="ftable" aria-labelledby="ftable-heading">
            <h2 id="ftable-heading">Tabell</h2>
            <f-table :rows :columns>
                <template #caption> Frukt och ursprung </template>
            </f-table>
        </section>

        <section id="fdefinitionlist" aria-labelledby="fdefinitionlist-heading">
            <h2 id="fdefinitionlist-heading">Definitionslista</h2>
            <f-definition-list :definitions />
        </section>

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
    </div>
</template>

<style scoped lang="scss">
section {
    margin-top: 2.5rem;
}

h3 {
    margin: 0;
}
</style>
