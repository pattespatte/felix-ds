<script setup lang="ts">
import { ref } from "vue";
import { FButton, FProgressbar } from "@fkui/vue";

const value = ref(40);

function increase(): void {
    value.value = Math.min(100, value.value + 20);
}
</script>

<template>
    <section id="fprogressbar" aria-labelledby="fprogressbar-heading" class="demo">
        <h2 id="fprogressbar-heading">FProgressbar</h2>
        <p class="demo__description">
            Förloppsindikator med känd procent – öka värdet med knappen.
        </p>
        <f-progressbar :value="value" aria-label="Pågående förlopp"></f-progressbar>
        <f-button size="medium" variant="secondary" @click="increase">
            Öka förloppet
        </f-button>
    </section>
</template>
