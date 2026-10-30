<script setup lang="ts">
import { FBadge } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";
</script>

<template>
    <section id="fbadge" aria-labelledby="fbadge-heading" class="demo">
        <component-heading id="fbadge-heading" :names="['FBadge']" />
        <p class="demo__description">
            Statusbrickor i de fem varianterna, standard och inverterad.
        </p>
        <div class="demo-row">
            <f-badge> Standard </f-badge>
            <f-badge status="info"> Info </f-badge>
            <f-badge status="success"> Klart </f-badge>
            <f-badge status="warning"> Varning </f-badge>
            <f-badge status="error"> Fel </f-badge>
        </div>
        <div class="demo-row">
            <f-badge inverted> Standard </f-badge>
            <f-badge inverted status="info"> Info </f-badge>
            <f-badge inverted status="success"> Klart </f-badge>
            <f-badge inverted status="warning"> Varning </f-badge>
            <f-badge inverted status="error"> Fel </f-badge>
        </div>
    </section>
</template>
