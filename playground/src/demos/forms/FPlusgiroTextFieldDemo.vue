<script setup lang="ts">
import { ref } from "vue";
import { FPlusgiroTextField } from "@fkui/vue";

const plusgiro = ref("");
</script>

<template>
    <section id="fplusgirotextfield" aria-labelledby="fplusgirotextfield-heading" class="demo">
        <h2 id="fplusgirotextfield-heading">FPlusgiroTextField</h2>
        <p class="demo__description">
            Plusgironummersfält med sifferkontroll – prova <em>1111-4</em> och ett
            värde med fel kontrollsiffra.
        </p>
        <f-plusgiro-text-field v-model="plusgiro"> Plusgironummer </f-plusgiro-text-field>
    </section>
</template>
