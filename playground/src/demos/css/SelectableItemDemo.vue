<script setup lang="ts">
import { ref } from "vue";
import { FCheckboxField, FFieldset, FRadioField } from "@fkui/vue";

const leveranssatt = ref("");
const extran = ref<string[]>([]);
</script>

<template>
    <section id="selectable-item" aria-labelledby="selectable-item-heading" class="demo">
        <h2 id="selectable-item-heading">Selectable item (valbart listobjekt)</h2>
        <p class="demo__description">
            SCSS-komponenten selectable item – kryssrutor och radioknappar som
            fullbreddsobjekt med ram och beskrivningstext via FFieldset.
        </p>
        <f-fieldset name="leveranssatt" border>
            <template #label> Leveranssätt </template>
            <f-radio-field v-model="leveranssatt" value="hem">
                Hemleverans
                <template #details> Levereras till dörren inom två dagar. </template>
            </f-radio-field>
            <f-radio-field v-model="leveranssatt" value="ombud">
                Utlämningsställe
                <template #details> Hämtas inom sju dagar. </template>
            </f-radio-field>
        </f-fieldset>
        <f-fieldset name="extran" border>
            <template #label> Tillval </template>
            <f-checkbox-field v-model="extran" value="forsakring">
                Försäkring
                <template #details> Ersätter skador upp till 10 000 kr. </template>
            </f-checkbox-field>
            <f-checkbox-field v-model="extran" value="sparsamt">
                Spårbar försändelse
                <template #details> Spårnummer skickas via e-post. </template>
            </f-checkbox-field>
        </f-fieldset>
    </section>
</template>
