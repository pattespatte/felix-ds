<script setup lang="ts">
import { ref } from "vue";
import {
    FButton,
    FFormModal,
    FFormModalAction,
    FTextField,
    FValidationFormAction,
} from "@fkui/vue";

// FFormModalAction och FValidationFormAction är samma api-enum (re-export):
// den används i before-submit för att tillåta eller avbryta inskickandet.
const isOpen = ref(false);
const namn = ref("");
const sparad = ref("");

function open(): void {
    namn.value = "";
    sparad.value = "";
    isOpen.value = true;
}

function beforeSubmit(): FFormModalAction {
    // FValidationFormAction.CONTINUE är samma värde – visas här för tydlighet.
    return FValidationFormAction.CONTINUE;
}

function onSubmit(): void {
    sparad.value = namn.value;
    isOpen.value = false;
}
</script>

<template>
    <section id="fformmodal" aria-labelledby="fformmodal-heading" class="demo">
        <h2 id="fformmodal-heading">FFormModal, FFormModalAction och FValidationFormAction</h2>
        <p class="demo__description">
            Formulärmodal med validering. Fälten kontrolleras innan inskick –
            försök spara med tomt namn.
        </p>
        <f-button size="medium" variant="primary" @click="open"> Ändra namn </f-button>
        <p v-if="sparad">Sparat namn: {{ sparad }}</p>

        <f-form-modal
            :is-open="isOpen"
            aria-close-text="Stäng"
            :before-submit
            @close="isOpen = false"
            @submit="onSubmit"
        >
            <template #header> Ändra namn </template>
            <template #input-text-fields>
                <f-text-field v-model="namn" v-validation.required :maxlength="100">
                    Namn
                </f-text-field>
            </template>
        </f-form-modal>
    </section>
</template>
