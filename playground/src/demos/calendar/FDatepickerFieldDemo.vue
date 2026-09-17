<script setup lang="ts">
import { ref } from "vue";
import { FDatepickerField } from "@fkui/vue";

const datum = ref("");
</script>

<template>
    <section id="fdatepickerfield" aria-labelledby="fdatepickerfield-heading" class="demo">
        <h2 id="fdatepickerfield-heading">FDatepickerField</h2>
        <p class="demo__description">
            Datumfält med kalenderpopover. Klicka på kalenderikonen för att öppna
            kalendern och välja ett datum.
        </p>
        <f-datepicker-field v-model="datum"> Bokningsdatum </f-datepicker-field>
    </section>
</template>
