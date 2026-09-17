<script setup lang="ts">
import { ref } from "vue";
import { FOrganisationsnummerTextField } from "@fkui/vue";

const organisationsnummer = ref("");
</script>

<template>
    <section id="forganisationsnummertextfield" aria-labelledby="forganisationsnummertextfield-heading" class="demo">
        <h2 id="forganisationsnummertextfield-heading">FOrganisationsnummerTextField</h2>
        <p class="demo__description">
            Organisationsnummersfält med sifferkontroll – prova <em>999999-9999</em>
            och ett värde med fel kontrollsiffra.
        </p>
        <f-organisationsnummer-text-field v-model="organisationsnummer">
            Organisationsnummer
        </f-organisationsnummer-text-field>
    </section>
</template>
