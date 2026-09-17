<script setup lang="ts">
import { FExpandablePanel } from "@fkui/vue";
</script>

<template>
    <section id="fexpandablepanel" aria-labelledby="fexpandablepanel-heading" class="demo">
        <h2 id="fexpandablepanel-heading">FExpandablePanel</h2>
        <p class="demo__description">
            Expanderbar panel med rubrik och innehåll – klicka för att veckla ut.
        </p>
        <f-expandable-panel>
            <template #title> Om temalagret </template>
            <template #default>
                Temat omdefinierar designvariabler som färger, typografi,
                linjetjocklekar och radier. Inga komponenter är omslutna eller
                omskrivna.
            </template>
        </f-expandable-panel>
    </section>
</template>
