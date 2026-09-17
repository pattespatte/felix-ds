<script setup lang="ts">
import { ref } from "vue";
import { FSelectField } from "@fkui/vue";

const ort = ref("");
</script>

<template>
    <section id="fselectfield" aria-labelledby="fselectfield-heading" class="demo">
        <h2 id="fselectfield-heading">FSelectField</h2>
        <p class="demo__description">Rulllista med etikett.</p>
        <f-select-field v-model="ort">
            <template #label> Ort </template>
            <option value="goteborg">Göteborg</option>
            <option value="stockholm">Stockholm</option>
            <option value="umea">Umeå</option>
        </f-select-field>
    </section>
</template>
