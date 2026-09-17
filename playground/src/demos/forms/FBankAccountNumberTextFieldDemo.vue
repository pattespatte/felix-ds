<script setup lang="ts">
import { ref } from "vue";
import { FBankAccountNumberTextField } from "@fkui/vue";

const bankkonto = ref("");
</script>

<template>
    <section id="fbankaccountnumbertextfield" aria-labelledby="fbankaccountnumbertextfield-heading" class="demo">
        <h2 id="fbankaccountnumbertextfield-heading">FBankAccountNumberTextField</h2>
        <p class="demo__description">
            Kontonummersfält som validerar clearing- och kontonummer.
        </p>
        <f-bank-account-number-text-field v-model="bankkonto">
            Bankkonto
        </f-bank-account-number-text-field>
    </section>
</template>
