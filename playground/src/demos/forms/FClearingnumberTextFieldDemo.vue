<script setup lang="ts">
import { ref } from "vue";
import { FClearingnumberTextField } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const clearingnummer = ref("");
</script>

<template>
    <section id="fclearingnumbertextfield" aria-labelledby="fclearingnumbertextfield-heading" class="demo">
        <component-heading id="fclearingnumbertextfield-heading" :names="['FClearingnumberTextField']" />
        <p class="demo__description">
            Clearingnummersfält (fyra till fem siffror) med validering.
        </p>
        <f-clearingnumber-text-field v-model="clearingnummer">
            Clearingnummer
        </f-clearingnumber-text-field>
    </section>
</template>
