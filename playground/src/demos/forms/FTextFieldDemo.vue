<script setup lang="ts">
import { ref } from "vue";
import { FTextField } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const fritext = ref("");
</script>

<template>
    <section id="ftextfield" aria-labelledby="ftextfield-heading" class="demo">
        <component-heading id="ftextfield-heading" :names="['FTextField']" />
        <p class="demo__description">
            Textfält med etikett som inte är obligatoriskt – du kan tabba förbi
            det tomt utan felmeddelande. Antalet tecken begränsas till 20 av
            validatorn maxLength – lämnar du fältet med en längre text visas
            ett fel. Validatorn whitelist kontrollerar medan du skriver:
            ogiltiga tecken, till exempel / och %, markeras direkt.
        </p>
        <f-text-field
            id="ftextfield-fritext"
            v-model="fritext"
            v-validation.whitelist.maxLength="{ maxLength: { length: 20 } }"
        >
            Fritext
        </f-text-field>
    </section>
</template>
