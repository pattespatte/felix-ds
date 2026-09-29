<script setup lang="ts">
import { ref } from "vue";
import { FSearchTextField } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const sokord = ref("");
</script>

<template>
    <section id="fsearchtextfield" aria-labelledby="fsearchtextfield-heading" class="demo">
        <component-heading id="fsearchtextfield-heading" :names="['FSearchTextField']" />
        <p class="demo__description">
            Sökfält med förstoringsglas och rensningsknapp.
        </p>
        <f-search-text-field v-model="sokord"> Sök i hjälpen </f-search-text-field>
    </section>
</template>
