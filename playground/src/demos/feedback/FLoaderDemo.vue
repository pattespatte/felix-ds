<script setup lang="ts">
import { FLoader } from "@fkui/vue";
</script>

<template>
    <section id="floader" aria-labelledby="floader-heading" class="demo">
        <h2 id="floader-heading">FLoader</h2>
        <p class="demo__description">
            Snurran visar att något pågår. Använd den när väntetiden är okänd.
        </p>
        <f-loader show />
    </section>
</template>
