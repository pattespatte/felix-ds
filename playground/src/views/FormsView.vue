<script setup lang="ts">
import { ref } from "vue";
import { FCheckboxField, FFieldset, FRadioField } from "@fkui/vue";
import FTextFieldDemo from "../demos/forms/FTextFieldDemo.vue";
import FTextareaFieldDemo from "../demos/forms/FTextareaFieldDemo.vue";
import FSelectFieldDemo from "../demos/forms/FSelectFieldDemo.vue";
import FCheckboxFieldDemo from "../demos/forms/FCheckboxFieldDemo.vue";
import FRadioFieldDemo from "../demos/forms/FRadioFieldDemo.vue";
import FFieldsetDemo from "../demos/forms/FFieldsetDemo.vue";
import FLabelDemo from "../demos/forms/FLabelDemo.vue";
import FStaticFieldDemo from "../demos/forms/FStaticFieldDemo.vue";
import FOutputFieldDemo from "../demos/forms/FOutputFieldDemo.vue";
import FValidationFormDemo from "../demos/forms/FValidationFormDemo.vue";
import FErrorListDemo from "../demos/forms/FErrorListDemo.vue";

// Tillfälligt chip-innehåll från v1 – flyttas till CSS-vyn i fas 3.
const chipAlternativ = ref("");
const chipVal = ref<string[]>([]);
</script>

<template>
    <div class="view">
        <h1>Formulär</h1>
        <p class="view__intro">
            Grundläggande formulärfält: inmatning, val, gruppering, validering
            och återkoppling. Prova båda temana med väljaren uppe till höger.
        </p>

        <f-text-field-demo />
        <f-textarea-field-demo />
        <f-select-field-demo />
        <f-checkbox-field-demo />
        <f-radio-field-demo />
        <f-fieldset-demo />
        <f-label-demo />
        <f-static-field-demo />
        <f-output-field-demo />
        <f-validation-form-demo />
        <f-error-list-demo />

        <!-- Tillfällig grupp från v1 – flyttas till CSS-vyn (chip) i fas 3. -->
        <section id="chip" aria-labelledby="chip-heading" class="demo">
            <h2 id="chip-heading">Chip</h2>
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
    </div>
</template>
