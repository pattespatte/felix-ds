<script setup lang="ts">
import { ref } from "vue";
import {
    FButton,
    FCheckboxField,
    FFieldset,
    FRadioField,
    FSearchTextField,
    FSelectField,
    FTextareaField,
    FTextField,
    FValidationForm,
} from "@fkui/vue";

const namn = ref("");
const meddelande = ref("");
const ort = ref("");
const sokord = ref("");
const intressen = ref<string[]>([]);
const kontakt = ref("");
const chipAlternativ = ref("");
const chipVal = ref<string[]>([]);
</script>

<template>
    <div class="view">
        <h1>Formulär</h1>
        <p class="view__intro">
            Skicka formuläret med tomt namnfält för att se felmarkering och
            fellistan (FErrorList) som valideringspluginet renderar.
        </p>

        <section id="fvalideringsform" aria-labelledby="fvalideringsform-heading">
            <h2 id="fvalideringsform-heading" class="sr-only">
                Valideringsformulär
            </h2>
            <f-validation-form>
                <template #error-message> Fel i följande fält: </template>

                <f-text-field id="namn" v-model="namn" v-validation.required :maxlength="100">
                    Namn
                </f-text-field>

                <f-textarea-field v-model="meddelande" v-validation.required :maxlength="500">
                    Meddelande
                </f-textarea-field>

                <f-select-field v-model="ort">
                    <template #label> Ort </template>
                    <option value="goteborg">Göteborg</option>
                    <option value="stockholm">Stockholm</option>
                    <option value="umea">Umeå</option>
                </f-select-field>

                <f-search-text-field v-model="sokord"> Sökord </f-search-text-field>

                <f-fieldset name="intressen">
                    <template #label> Intressen </template>
                    <f-checkbox-field v-model="intressen" value="design"> Design </f-checkbox-field>
                    <f-checkbox-field v-model="intressen" value="kod"> Kod </f-checkbox-field>
                    <f-checkbox-field v-model="intressen" value="typografi"> Typografi </f-checkbox-field>
                </f-fieldset>

                <f-fieldset name="kontakt" v-validation.required>
                    <template #label> Önskad kontaktväg </template>
                    <f-radio-field v-model="kontakt" value="epost"> E-post </f-radio-field>
                    <f-radio-field v-model="kontakt" value="telefon"> Telefon </f-radio-field>
                    <f-radio-field v-model="kontakt" value="brev"> Brev </f-radio-field>
                </f-fieldset>

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

                <f-button type="submit" size="medium" variant="primary"> Skicka </f-button>
            </f-validation-form>
        </section>
    </div>
</template>

<style scoped lang="scss">
section {
    margin-top: 1.5rem;
}
</style>
