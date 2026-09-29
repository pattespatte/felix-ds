<script setup lang="ts">
import { FBadge } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";
</script>

<template>
    <section id="fbadge" aria-labelledby="fbadge-heading" class="demo">
        <component-heading id="fbadge-heading" :names="['FBadge']" />
        <p class="demo__description">
            Statusbrickor i de fem varianterna.
        </p>
        <div class="demo-row">
            <f-badge> Standard </f-badge>
            <f-badge status="info"> Info </f-badge>
            <f-badge status="success"> Klart </f-badge>
            <f-badge status="warning"> Varning </f-badge>
            <f-badge status="error"> Fel </f-badge>
        </div>
    </section>
</template>
