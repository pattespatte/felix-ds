<script setup lang="ts">
import { ref } from "vue";
import { FBankgiroTextField } from "@fkui/vue";

const bankgiro = ref("");
</script>

<template>
    <section id="fbankgirotextfield" aria-labelledby="fbankgirotextfield-heading" class="demo">
        <h2 id="fbankgirotextfield-heading">FBankgiroTextField</h2>
        <p class="demo__description">
            Bankgironummersfält med sifferkontroll – prova <em>999-9996</em> och
            ett värde med fel siffra.
        </p>
        <f-bankgiro-text-field v-model="bankgiro"> Bankgironummer </f-bankgiro-text-field>
    </section>
</template>
