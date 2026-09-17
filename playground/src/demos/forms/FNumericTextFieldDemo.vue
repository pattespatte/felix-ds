<script setup lang="ts">
import { ref } from "vue";
import { FNumericTextField } from "@fkui/vue";

const antal = ref(1000);
</script>

<template>
    <section id="fnumerictextfield" aria-labelledby="fnumerictextfield-heading" class="demo">
        <h2 id="fnumerictextfield-heading">FNumericTextField</h2>
        <p class="demo__description">
            Numeriskt fält som formaterar värdet med svenska tusentalsavgränsare
            när fältet lämnas – skriv <em>10000</em> och tryck på Tab så visas
            <em>10 000</em>.
        </p>
        <f-numeric-text-field v-model="antal" :decimals="0"> Antal exemplar </f-numeric-text-field>
    </section>
</template>
