<script setup lang="ts">
import { ref } from "vue";
import { FCheckboxField } from "@fkui/vue";

const nyhetsbrev = ref("");
</script>

<template>
    <section id="fcheckboxfield" aria-labelledby="fcheckboxfield-heading" class="demo">
        <h2 id="fcheckboxfield-heading">FCheckboxField</h2>
        <p class="demo__description">
            Enskild kryssruta. Flera kryssrutor grupperas i ett fältset – se
            FFieldset.
        </p>
        <f-checkbox-field v-model="nyhetsbrev" value="ja">
            Jag vill ha nyhetsbrev
        </f-checkbox-field>
    </section>
</template>
