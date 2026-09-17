<script setup lang="ts">
import { ref } from "vue";
import { FButton, FConfirmModal } from "@fkui/vue";

const isOpen = ref(false);
const resultat = ref("");

function onConfirm(): void {
    isOpen.value = false;
    resultat.value = "Raden togs bort.";
}

function onClose(): void {
    isOpen.value = false;
}
</script>

<template>
    <section id="fconfirmmodal" aria-labelledby="fconfirmmodal-heading" class="demo">
        <h2 id="fconfirmmodal-heading">FConfirmModal</h2>
        <p class="demo__description">
            Bekräftelsedialog med automatiska knappar för- och avbryt.
        </p>
        <f-button size="medium" variant="secondary" @click="isOpen = true">
            Ta bort rad
        </f-button>
        <p v-if="resultat">{{ resultat }}</p>

        <f-confirm-modal
            :is-open="isOpen"
            :buttons="[
                { label: 'Ja, ta bort raden', type: 'primary', event: 'confirm' },
                { label: 'Avbryt', type: 'secondary', event: 'dismiss' },
            ]"
            @confirm="onConfirm"
            @close="onClose"
        >
            <template #heading> Ta bort rad? </template>
            <template #content>
                <p>Raden ”Skicka rapport” tas bort permanent.</p>
            </template>
        </f-confirm-modal>
    </section>
</template>
