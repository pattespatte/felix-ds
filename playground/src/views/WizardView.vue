<script setup lang="ts">
import FWizardDemo from "../demos/wizard/FWizardDemo.vue";
</script>

<template>
    <div class="view">
        <h1>Stegvisa flöden</h1>
        <p class="view__intro">
            Använd wizarden när ett flöde ska delas upp i steg med validering
            längs vägen. Guidad flödeskomponent med validering per steg.
        </p>

        <f-wizard-demo />
    </div>
</template>
