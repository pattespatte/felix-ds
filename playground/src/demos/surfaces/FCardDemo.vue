<script setup lang="ts">
import { FButton, FCard } from "@fkui/vue";

const emit = defineEmits<{ openModal: [] }>();
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
                <f-button size="medium" variant="primary" @click="emit('openModal')">
                    Öppna modal
                </f-button>
            </template>
        </f-card>
    </section>
</template>
