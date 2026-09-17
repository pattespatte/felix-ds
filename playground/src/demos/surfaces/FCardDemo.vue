<script setup lang="ts">
import { ref } from "vue";
import { FButton, FCard, FModal } from "@fkui/vue";

const modalOpen = ref(false);
</script>

<template>
    <section id="fcard" aria-labelledby="fcard-heading" class="demo">
        <h2 id="fcard-heading">FCard</h2>
        <p class="demo__description">
            Kort samlar sammanhängande information med rubrik, innehåll och en
            sidfot med åtgärder.
        </p>
        <f-card>
            <template #header="{ headingSlotClass }">
                <h3 :class="headingSlotClass">Temakort</h3>
            </template>
            <template #default>
                Ett kort visar sammanhängande information. Utfyllnaden, radier
                och eventuell skugga styrs av temats tokens.
            </template>
            <template #footer>
                <f-button size="medium" variant="primary" @click="modalOpen = true">
                    Öppna modal
                </f-button>
            </template>
        </f-card>

        <f-modal :is-open="modalOpen" @close="modalOpen = false">
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
                        @click="modalOpen = false"
                    >
                        Stäng
                    </f-button>
                </div>
            </template>
        </f-modal>
    </section>
</template>
