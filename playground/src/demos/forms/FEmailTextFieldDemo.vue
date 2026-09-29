<script setup lang="ts">
import { ref } from "vue";
import { FEmailTextField } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const epost = ref("");
</script>

<template>
    <section id="femailtextfield" aria-labelledby="femailtextfield-heading" class="demo">
        <component-heading id="femailtextfield-heading" :names="['FEmailTextField']" />
        <p class="demo__description">
            E-postfält med formatvalidering – prova <em>exempel@exempel.se</em> och
            <em>exempel@</em>.
        </p>
        <f-email-text-field v-model="epost"> E-postadress </f-email-text-field>
    </section>
</template>
