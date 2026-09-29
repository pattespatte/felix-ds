<script setup lang="ts">
import { FDefinitionList } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const definitions = [
    { term: "Version", definition: "0.1.0 (proof of concept)" },
    { term: "Temamodell", definition: "CSS-variabler ovanpå FKUI:s npm-paket" },
    { term: "Typografi", definition: "Noto Sans (text), Roboto Slab (rubriker)" },
];
</script>

<template>
    <section id="fdefinitionlist" aria-labelledby="fdefinitionlist-heading" class="demo">
        <component-heading id="fdefinitionlist-heading" :names="['FDefinitionList']" />
        <p class="demo__description">
            Definitionslista – termer med tillhörande förklaringar.
        </p>
        <f-definition-list :definitions />
    </section>
</template>
