<script setup lang="ts">
import { ref } from "vue";
import { FSearchTextField } from "@fkui/vue";

const sokord = ref("");
</script>

<template>
    <section id="fsearchtextfield" aria-labelledby="fsearchtextfield-heading" class="demo">
        <h2 id="fsearchtextfield-heading">FSearchTextField</h2>
        <p class="demo__description">
            Sökfält med förstoringsglas och rensningsknapp.
        </p>
        <f-search-text-field v-model="sokord"> Sök i hjälpen </f-search-text-field>
    </section>
</template>
