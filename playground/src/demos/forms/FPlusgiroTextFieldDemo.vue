<script setup lang="ts">
import { ref } from "vue";
import { FPlusgiroTextField } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const plusgiro = ref("");
</script>

<template>
    <section id="fplusgirotextfield" aria-labelledby="fplusgirotextfield-heading" class="demo">
        <component-heading id="fplusgirotextfield-heading" :names="['FPlusgiroTextField']" />
        <p class="demo__description">
            Plusgironummersfält med sifferkontroll – prova <em>1111-4</em> och ett
            värde med fel kontrollsiffra.
        </p>
        <f-plusgiro-text-field v-model="plusgiro"> Plusgironummer </f-plusgiro-text-field>
    </section>
</template>
