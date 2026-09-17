<script setup lang="ts">
import { ref } from "vue";
import { FPostalCodeTextField } from "@fkui/vue";

const postnummer = ref("");
</script>

<template>
    <section id="fpostalcodetextfield" aria-labelledby="fpostalcodetextfield-heading" class="demo">
        <h2 id="fpostalcodetextfield-heading">FPostalCodeTextField</h2>
        <p class="demo__description">
            Postnummersfält som formaterar fem siffror med mellanslag – skriv
            <em>41842</em> och lämna fältet.
        </p>
        <f-postal-code-text-field v-model="postnummer"> Postnummer </f-postal-code-text-field>
    </section>
</template>
