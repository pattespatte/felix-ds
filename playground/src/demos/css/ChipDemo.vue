<script setup lang="ts">
import { ref } from "vue";
import { FCheckboxField, FFieldset, FRadioField } from "@fkui/vue";

const chipAlternativ = ref("");
const chipVal = ref<string[]>([]);
</script>

<template>
    <section id="chip" aria-labelledby="chip-heading" class="demo">
        <h2 id="chip-heading">Chip</h2>
        <p class="demo__description">
            SCSS-komponenten chip – radioknappar och kryssrutor i chip-layout
            via FFieldset.
        </p>
        <f-fieldset name="chip-alternativ" chip>
            <template #label> Chip – radioknappar </template>
            <f-radio-field v-model="chipAlternativ" value="ett"> Alternativ ett </f-radio-field>
            <f-radio-field v-model="chipAlternativ" value="tva"> Alternativ två </f-radio-field>
            <f-radio-field v-model="chipAlternativ" value="tre"> Alternativ tre </f-radio-field>
        </f-fieldset>
        <f-fieldset name="chip-val" chip>
            <template #label> Chip – kryssrutor </template>
            <f-checkbox-field v-model="chipVal" value="a"> Val A </f-checkbox-field>
            <f-checkbox-field v-model="chipVal" value="b"> Val B </f-checkbox-field>
            <f-checkbox-field v-model="chipVal" value="c"> Val C </f-checkbox-field>
        </f-fieldset>
    </section>
</template>
