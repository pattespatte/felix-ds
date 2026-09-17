<script setup lang="ts">
import { useTemplateRef } from "vue";
import { FTooltip } from "@fkui/vue";

const heading = useTemplateRef<HTMLHeadingElement>("tooltip-heading");
</script>

<template>
    <section id="ftooltip" aria-labelledby="ftooltip-heading" class="demo">
        <h2 id="ftooltip-heading">FTooltip</h2>
        <p class="demo__description">
            Tooltip med rubrik och brödtext, fäst vid elementet under.
        </p>
        <h3 ref="tooltip-heading">Rubrik med tooltip</h3>
        <f-tooltip
            :attach-to="heading"
            screen-reader-text="Information om rubriken med tooltip"
            header-tag="h4"
        >
            <template #header> Om rubriken </template>
            <template #body>
                Detta är en tooltip som visar mer detaljerad information än vad
                som får plats i etiketten.
            </template>
        </f-tooltip>
    </section>
</template>
