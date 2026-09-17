<script setup lang="ts">
import { ref } from "vue";
import { FCheckboxField, FFieldset, FRadioField } from "@fkui/vue";
import FTextFieldDemo from "../demos/forms/FTextFieldDemo.vue";
import FSearchTextFieldDemo from "../demos/forms/FSearchTextFieldDemo.vue";
import FNumericTextFieldDemo from "../demos/forms/FNumericTextFieldDemo.vue";
import FCurrencyTextFieldDemo from "../demos/forms/FCurrencyTextFieldDemo.vue";
import FPercentTextFieldDemo from "../demos/forms/FPercentTextFieldDemo.vue";
import FPhoneTextFieldDemo from "../demos/forms/FPhoneTextFieldDemo.vue";
import FEmailTextFieldDemo from "../demos/forms/FEmailTextFieldDemo.vue";
import FPostalCodeTextFieldDemo from "../demos/forms/FPostalCodeTextFieldDemo.vue";
import FPersonnummerTextFieldDemo from "../demos/forms/FPersonnummerTextFieldDemo.vue";
import FOrganisationsnummerTextFieldDemo from "../demos/forms/FOrganisationsnummerTextFieldDemo.vue";
import FBankAccountNumberTextFieldDemo from "../demos/forms/FBankAccountNumberTextFieldDemo.vue";
import FBankgiroTextFieldDemo from "../demos/forms/FBankgiroTextFieldDemo.vue";
import FClearingnumberTextFieldDemo from "../demos/forms/FClearingnumberTextFieldDemo.vue";
import FPlusgiroTextFieldDemo from "../demos/forms/FPlusgiroTextFieldDemo.vue";
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
        <f-search-text-field-demo />
        <f-numeric-text-field-demo />
        <f-currency-text-field-demo />
        <f-percent-text-field-demo />
        <f-phone-text-field-demo />
        <f-email-text-field-demo />
        <f-postal-code-text-field-demo />
        <f-personnummer-text-field-demo />
        <f-organisationsnummer-text-field-demo />
        <f-bank-account-number-text-field-demo />
        <f-bankgiro-text-field-demo />
        <f-clearingnumber-text-field-demo />
        <f-plusgiro-text-field-demo />
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
