<script setup lang="ts">
import { ref } from "vue";
import { FPersonnummerTextField } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const personnummer = ref("");
</script>

<template>
    <section id="fpersonnummertextfield" aria-labelledby="fpersonnummertextfield-heading" class="demo">
        <component-heading id="fpersonnummertextfield-heading" :names="['FPersonnummerTextField']" />
        <p class="demo__description">
            Personnummersfält med kalenderkontroll och formatvalidering – prova
            <em>8112189876</em> (formatgodkänt exempelvärde) och ett ogiltigt.
        </p>
        <f-personnummer-text-field v-model="personnummer"> Personnummer </f-personnummer-text-field>
    </section>
</template>
