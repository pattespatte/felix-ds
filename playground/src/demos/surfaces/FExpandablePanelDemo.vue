<script setup lang="ts">
import { ref } from "vue";
import { FExpandablePanel } from "@fkui/vue";

const expanderad = ref(false);
</script>

<template>
    <section id="fexpandablepanel" aria-labelledby="fexpandablepanel-heading" class="demo">
        <h2 id="fexpandablepanel-heading">FExpandablePanel</h2>
        <p class="demo__description">
            Expanderbar panel med rubrik och innehåll – klicka för att veckla ut.
        </p>
        <f-expandable-panel
            :expanded="expanderad"
            @toggle="expanderad = !expanderad"
        >
            <template #title> Om temalagret </template>
            <template #default>
                Temat omdefinierar designvariabler som färger, typografi,
                linjetjocklekar och radier. Inga komponenter är omslutna eller
                omskrivna.
            </template>
        </f-expandable-panel>
    </section>
</template>
