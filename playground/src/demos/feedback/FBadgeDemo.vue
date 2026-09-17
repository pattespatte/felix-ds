<script setup lang="ts">
import { FBadge } from "@fkui/vue";
</script>

<template>
    <section id="fbadge" aria-labelledby="fbadge-heading" class="demo">
        <h2 id="fbadge-heading">FBadge</h2>
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
