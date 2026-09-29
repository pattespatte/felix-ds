<script setup lang="ts">
import { ref } from "vue";
import { FCurrencyTextField } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const pris = ref(1500);
</script>

<template>
    <section id="fcurrencytextfield" aria-labelledby="fcurrencytextfield-heading" class="demo">
        <component-heading id="fcurrencytextfield-heading" :names="['FCurrencyTextField']" />
        <p class="demo__description">
            Beloppsfält med svensk talformat. Fältet tar emot heltalsbelopp –
            skriv <em>15000</em> och lämna fältet så formateras värdet med
            tusentalsavgränsare.
        </p>
        <f-currency-text-field v-model="pris"> Pris </f-currency-text-field>
    </section>
</template>
