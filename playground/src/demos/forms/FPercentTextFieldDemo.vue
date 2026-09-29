<script setup lang="ts">
import { ref } from "vue";
import { FPercentTextField } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const rabatt = ref(25);
</script>

<template>
    <section id="fpercenttextfield" aria-labelledby="fpercenttextfield-heading" class="demo">
        <component-heading id="fpercenttextfield-heading" :names="['FPercentTextField']" />
        <p class="demo__description">
            Procentfält för värden 0–999 med svensk talformat. Skriv <em>75</em>
            och lämna fältet – värdet valideras som procent.
        </p>
        <f-percent-text-field v-model="rabatt" :decimals="0"> Rabatt </f-percent-text-field>
    </section>
</template>
