<script setup lang="ts">
import { ref } from "vue";
import {
    FButton,
    FStaticField,
    FTextField,
    FValidationForm,
    FValidationGroup,
    type GroupValidityEvent,
} from "@fkui/vue";

const namn = ref("");
const epost = ref("");
const kontaktuppgifter = ref({} as GroupValidityEvent);
</script>

<template>
    <section id="fvalidationform" aria-labelledby="fvalidationform-heading" class="demo">
        <h2 id="fvalidationform-heading">FValidationForm och FValidationGroup</h2>
        <p class="demo__description">
            Valideringsformulär som samlar felen i en fellista (FErrorList) när
            man skickar med tomma obligatoriska fält. FValidationGroup
            aggregerar delgruppens giltighet – groupens status visas under
            formuläret.
        </p>
        <f-validation-form>
            <template #error-message> Fel i följande fält: </template>

            <f-text-field id="fvalideringsform-namn" v-model="namn" v-validation.required :maxlength="100">
                Namn
            </f-text-field>

            <f-validation-group v-model="kontaktuppgifter" name="kontaktuppgifter">
                <f-text-field id="fvalideringsform-epost" v-model="epost" v-validation.required.email :maxlength="100">
                    E-postadress
                </f-text-field>
                <f-static-field model-value="Kundtjänst, 0771-00 00 00">
                    <template #label> Utfärdare </template>
                    <template #default> Kundtjänst, 0771-00 00 00 </template>
                </f-static-field>
            </f-validation-group>

            <f-button type="submit" size="medium" variant="primary"> Skicka </f-button>
        </f-validation-form>

        <p class="validation-group-status">
            Delgruppens giltighet: {{ kontaktuppgifter?.isValid ? "giltig" : "inte giltig" }}
        </p>
    </section>
</template>

<style scoped lang="scss">
.validation-group-status {
    margin-top: 1rem;
    color: var(--fkds-color-text-secondary, #585f71);
}
</style>
