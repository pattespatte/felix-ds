<script setup lang="ts">
import { ref } from "vue";
import { FButton, FModal } from "@fkui/vue";

const isOpen = ref(false);
</script>

<template>
    <section id="fmodal" aria-labelledby="fmodal-heading" class="demo">
        <h2 id="fmodal-heading">FModal</h2>
        <p class="demo__description">
            Modal dialog som öppnas från en knapp. Backdrop, z-index och
            fokusHantering styrs av temats tokens.
        </p>
        <f-button size="medium" variant="primary" @click="isOpen = true">
            Öppna modal
        </f-button>

        <f-modal :is-open="isOpen" @close="isOpen = false">
            <template #header> Bekräfta </template>
            <template #content>
                Detta är en modal som följer det aktiva temat.
            </template>
            <template #footer>
                <div class="button-group">
                    <f-button
                        class="button-group__item"
                        size="medium"
                        variant="primary"
                        @click="isOpen = false"
                    >
                        Stäng
                    </f-button>
                </div>
            </template>
        </f-modal>
    </section>
</template>
