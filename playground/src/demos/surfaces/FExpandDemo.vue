<script setup lang="ts">
import { ref } from "vue";
import { FButton, FExpand } from "@fkui/vue";

const expanded = ref(false);
</script>

<template>
    <section id="fexpand" aria-labelledby="fexpand-heading" class="demo">
        <h2 id="fexpand-heading">FExpand</h2>
        <p class="demo__description">
            Expanderingsområde utan egen knapp – synligheten styrs externt.
        </p>
        <f-button size="medium" variant="secondary" @click="expanded = !expanded">
            {{ expanded ? "Stäng" : "Visa mer" }}
        </f-button>
        <f-expand>
            <div v-if="expanded" class="expand-demo__content">
                Innehållet vecklas ut mjukt när området blir synligt.
            </div>
        </f-expand>
    </section>
</template>

<style scoped lang="scss">
.expand-demo__content {
    padding: 1rem;
    border: 1px solid var(--fkds-color-border-weak, #d7d9e0);
    border-radius: var(--f-border-radius-medium, 8px);
    margin-top: 1rem;
}
</style>
