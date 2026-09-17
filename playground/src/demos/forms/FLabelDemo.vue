<script setup lang="ts">
import { FLabel } from "@fkui/vue";
</script>

<template>
    <section id="flabel" aria-labelledby="flabel-heading" class="demo">
        <h2 id="flabel-heading">FLabel</h2>
        <p class="demo__description">
            Fristående etikett kopplad till ett inmatningsfält via
            <code>for</code>-attributet, med en valfri beskrivning under etiketten.
        </p>
        <div class="label-demo">
            <f-label for="flabel-organisationsnummer">
                Organisationsnummer
                <template #description="{ descriptionClass, formatDescriptionClass }">
                    <span :class="descriptionClass">Tio siffror</span>
                    <span :class="formatDescriptionClass">ÅÅÅÅMMDD-XXXX</span>
                </template>
            </f-label>
            <input id="flabel-organisationsnummer" class="label-demo__input" type="text" />
        </div>
    </section>
</template>

<style scoped lang="scss">
.label-demo__input {
    padding: 0.5rem;
    border: 1px solid var(--fkds-color-border-primary, #6e7689);
    border-radius: var(--f-border-radius-medium, 8px);
    font: inherit;
}
</style>
