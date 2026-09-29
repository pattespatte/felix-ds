<script setup lang="ts">
import { ref } from "vue";
import { FDatepickerField } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const datum = ref("");
</script>

<template>
    <section id="fdatepickerfield" aria-labelledby="fdatepickerfield-heading" class="demo">
        <component-heading id="fdatepickerfield-heading" :names="['FDatepickerField']" />
        <p class="demo__description">
            Datumfält med kalenderpopover. Klicka på kalenderikonen för att öppna
            kalendern och välja ett datum.
        </p>
        <f-datepicker-field v-model="datum"> Bokningsdatum </f-datepicker-field>
    </section>
</template>
