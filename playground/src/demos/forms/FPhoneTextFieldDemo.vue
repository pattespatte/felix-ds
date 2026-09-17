<script setup lang="ts">
import { ref } from "vue";
import { FPhoneTextField } from "@fkui/vue";

const telefon = ref("");
</script>

<template>
    <section id="fphonetextfield" aria-labelledby="fphonetextfield-heading" class="demo">
        <h2 id="fphonetextfield-heading">FPhoneTextField</h2>
        <p class="demo__description">
            Telefonfält som validerar format vid fokuslämnande – prova ett giltigt
            nummer (t.ex. <em>0701-23 45 67</em>) och ett ogiltigt (t.ex. <em>abc</em>).
        </p>
        <f-phone-text-field v-model="telefon"> Telefonnummer </f-phone-text-field>
    </section>
</template>
