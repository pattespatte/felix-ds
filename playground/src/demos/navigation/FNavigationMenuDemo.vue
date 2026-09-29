<script setup lang="ts">
import { FNavigationMenu } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const routes = [
    { label: "Att komma åt", route: "/knappar" },
    { label: "Formulär", route: "/formular" },
    { label: "Datum och kalender", route: "/kalender" },
];
</script>

<template>
    <section id="fnavigationmenu" aria-labelledby="fnavigationmenu-heading" class="demo">
        <component-heading id="fnavigationmenu-heading" :names="['FNavigationMenu']" />
        <p class="demo__description">
            Navigeringsmeny med länklista – horisontell som standard.
        </p>
        <f-navigation-menu :routes />
    </section>
</template>
