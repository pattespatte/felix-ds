<script setup lang="ts">
import { FLoader } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";
</script>

<template>
    <section id="floader" aria-labelledby="floader-heading" class="demo">
        <component-heading id="floader-heading" :names="['FLoader']" />
        <p class="demo__description">
            Snurran visar att något pågår. Använd den när väntetiden är okänd.
        </p>
        <f-loader show />
    </section>
</template>
