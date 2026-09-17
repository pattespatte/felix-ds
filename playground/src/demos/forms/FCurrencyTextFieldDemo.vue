<script setup lang="ts">
import { ref } from "vue";
import { FCurrencyTextField } from "@fkui/vue";

const pris = ref(1500);
</script>

<template>
    <section id="fcurrencytextfield" aria-labelledby="fcurrencytextfield-heading" class="demo">
        <h2 id="fcurrencytextfield-heading">FCurrencyTextField</h2>
        <p class="demo__description">
            Beloppsfält med svensk talformat. Fältet tar emot heltalsbelopp –
            skriv <em>15000</em> och lämna fältet så formateras värdet med
            tusentalsavgränsare.
        </p>
        <f-currency-text-field v-model="pris"> Pris </f-currency-text-field>
    </section>
</template>
