<script setup lang="ts">
import { ref } from "vue";
import { FCheckboxField, FFieldset } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const intressen = ref<string[]>([]);
</script>

<template>
    <section id="ffieldset" aria-labelledby="ffieldset-heading" class="demo">
        <component-heading id="ffieldset-heading" :names="['FFieldset']" />
        <p class="demo__description">
            Fältset grupperar sammanhörande fält under en gemensam etikett och
            gör gruppvalidering möjlig.
        </p>
        <f-fieldset name="intressen" v-validation.required>
            <template #label> Intressen </template>
            <f-checkbox-field v-model="intressen" value="design"> Design </f-checkbox-field>
            <f-checkbox-field v-model="intressen" value="kod"> Kod </f-checkbox-field>
            <f-checkbox-field v-model="intressen" value="typografi"> Typografi </f-checkbox-field>
        </f-fieldset>
    </section>
</template>
