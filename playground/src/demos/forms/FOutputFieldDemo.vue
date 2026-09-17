<script setup lang="ts">
import { computed, ref } from "vue";
import { FOutputField } from "@fkui/vue";

const antalVuxna = ref(2);
const antalBarn = ref(1);
const antalTotal = computed(() => antalVuxna.value + antalBarn.value);
</script>

<template>
    <section id="foutputfield" aria-labelledby="foutputfield-heading" class="demo">
        <h2 id="foutputfield-heading">FOutputField</h2>
        <p class="demo__description">
            Utdatafält som visar ett beräknat resultat live, kopplat till de
            fält det beror på via <code>for</code>.
        </p>
        <div class="output-demo">
            <label>
                Vuxna
                <input
                    id="foutputfield-vuxna"
                    v-model.number="antalVuxna"
                    class="output-demo__input"
                    type="number"
                    min="0"
                />
            </label>
            <label>
                Barn
                <input
                    id="foutputfield-barn"
                    v-model.number="antalBarn"
                    class="output-demo__input"
                    type="number"
                    min="0"
                />
            </label>
            <f-output-field id="foutputfield-total" for="foutputfield-vuxna foutputfield-barn">
                <template #label> Antal resenärer </template>
                {{ antalTotal }}
            </f-output-field>
        </div>
    </section>
</template>

<style scoped lang="scss">
.output-demo {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    align-items: flex-end;
    max-width: 40rem;
}

.output-demo label {
    display: grid;
    gap: 0.25rem;
}

.output-demo__input {
    padding: 0.5rem;
    border: 1px solid var(--fkds-color-border-primary, #6e7689);
    border-radius: var(--f-border-radius-medium, 8px);
    font: inherit;
}
</style>
