<script setup lang="ts">
import { ref } from "vue";
import { FButton } from "@fkui/vue";

const synlig = ref(true);
const stangdMeddelande = ref("");
</script>

<template>
    <section id="close-button" aria-labelledby="close-button-heading" class="demo">
        <h2 id="close-button-heading">Close button (stängknapp)</h2>
        <p class="demo__description">
            Ren SCSS-komponent för stängknappar – här som avvisbar notis med
            synlig text.
        </p>
        <div v-if="synlig" class="close-button-demo__notis">
            <p>Du har en ny notis i inkorgen.</p>
            <button class="close-button" type="button" @click="synlig = false">
                <svg
                    focusable="false"
                    aria-hidden="true"
                    class="icon f-icon-close"
                >
                    <use href="#f-icon-close"></use>
                </svg>
                Stäng
            </button>
        </div>
        <p v-else>
            Notisen stängdes.
            <f-button variant="secondary" size="medium" @click="synlig = true">
                Visa igen
            </f-button>
        </p>
    </section>
</template>

<style scoped lang="scss">
.close-button-demo__notis {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border: 1px solid var(--fkds-color-border-weak, #d7d9e0);
    border-radius: var(--fkds-radius-card, 8px);
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    max-width: 32rem;
}

.close-button-demo__notis p {
    margin: 0;
}
</style>
