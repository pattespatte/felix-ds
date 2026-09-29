<script setup lang="ts">
import { ref } from "vue";
import { FTextareaField } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const meddelande = ref("");
</script>

<template>
    <section id="ftextareafield" aria-labelledby="ftextareafield-heading" class="demo">
        <component-heading id="ftextareafield-heading" :names="['FTextareaField']" />
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
