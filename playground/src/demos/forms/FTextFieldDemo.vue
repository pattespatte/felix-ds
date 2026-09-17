<script setup lang="ts">
import { ref } from "vue";
import { FTextField } from "@fkui/vue";

const epost = ref("");
</script>

<template>
    <section id="ftextfield" aria-labelledby="ftextfield-heading" class="demo">
        <h2 id="ftextfield-heading">FTextField</h2>
        <p class="demo__description">
            Textfält med etikett. Fältet valideras som obligatoriskt – lämna det
            tomt och tryck på Tab för att se felmarkeringen.
        </p>
        <f-text-field
            id="ftextfield-epost"
            v-model="epost"
            v-validation.required
            :maxlength="100"
        >
            E-postadress
        </f-text-field>
    </section>
</template>
