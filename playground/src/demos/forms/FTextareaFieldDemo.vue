<script setup lang="ts">
import { ref } from "vue";
import { FTextareaField } from "@fkui/vue";

const meddelande = ref("");
</script>

<template>
    <section id="ftextareafield" aria-labelledby="ftextareafield-heading" class="demo">
        <h2 id="ftextareafield-heading">FTextareaField</h2>
        <p class="demo__description">
            Textruta för längre fritext med teckengräns.
        </p>
        <f-textarea-field
            v-model="meddelande"
            v-validation.required
            :maxlength="500"
        >
            Meddelande
        </f-textarea-field>
    </section>
</template>
