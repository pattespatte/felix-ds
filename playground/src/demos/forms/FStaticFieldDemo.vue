<script setup lang="ts">
import { FStaticField } from "@fkui/vue";
</script>

<template>
    <section id="fstaticfield" aria-labelledby="fstaticfield-heading" class="demo">
        <h2 id="fstaticfield-heading">FStaticField</h2>
        <p class="demo__description">
            Skrivskyddat fält för värden användaren inte ska ändra – etikett och
            värde presenteras som text.
        </p>
        <f-static-field model-value="2026-09-17">
            <template #label> Registreringsdatum </template>
            <template #default> 2026-09-17 </template>
        </f-static-field>
    </section>
</template>
