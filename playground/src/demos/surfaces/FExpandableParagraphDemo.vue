<script setup lang="ts">
import { FExpandableParagraph } from "@fkui/vue";
</script>

<template>
    <section id="fexpandableparagraph" aria-labelledby="fexpandableparagraph-heading" class="demo">
        <h2 id="fexpandableparagraph-heading">FExpandableParagraph</h2>
        <p class="demo__description">
            Expanderbar paragraf med egen knapp i rubriken.
        </p>
        <f-expandable-paragraph header-tag="h3">
            <template #title> Vanliga frågor om temat </template>
            <template #default>
                Temat är ett tunt lager av CSS-variabler ovanpå FKUI:s publika
                npm-paket. Det läggs till eller tas bort utan att några
                komponenter byts ut.
            </template>
        </f-expandable-paragraph>
    </section>
</template>
