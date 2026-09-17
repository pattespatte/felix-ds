<script setup lang="ts">
import { ref } from "vue";
import { FFieldset, FRadioField } from "@fkui/vue";

const kontakt = ref("");
</script>

<template>
    <section id="fradiofield" aria-labelledby="fradiofield-heading" class="demo">
        <h2 id="fradiofield-heading">FRadioField</h2>
        <p class="demo__description">
            Radioknappar – en av flera alternativ – grupperade i ett fältset.
        </p>
        <f-fieldset name="kontakt" v-validation.required>
            <template #label> Önskad kontaktväg </template>
            <f-radio-field v-model="kontakt" value="epost"> E-post </f-radio-field>
            <f-radio-field v-model="kontakt" value="telefon"> Telefon </f-radio-field>
            <f-radio-field v-model="kontakt" value="brev"> Brev </f-radio-field>
        </f-fieldset>
    </section>
</template>
