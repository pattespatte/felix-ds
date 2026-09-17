<script setup lang="ts">
import { FErrorList } from "@fkui/vue";
import type { ErrorItem } from "@fkui/vue";

const errors: ErrorItem[] = [
    { title: "Namn måste anges", id: "ftextfield-epost" },
    { title: "Ogiltigt format i e-postadress", id: "ftextfield-epost" },
    { title: "Ort måste väljas" },
];
</script>

<template>
    <section id="ferrorlist" aria-labelledby="ferrorlist-heading" class="demo">
        <h2 id="ferrorlist-heading">FErrorList</h2>
        <p class="demo__description">
            Fellistan används normalt av valideringsformuläret (se ovan), men kan
            också renderas fristående. Rader med element-id blir klickbara
            länkar som flyttar fokus till fältet.
        </p>
        <f-error-list :items="errors">
            <template #title> Fel i följande fält: </template>
        </f-error-list>
    </section>
</template>
