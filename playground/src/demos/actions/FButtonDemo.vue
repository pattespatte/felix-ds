<script setup lang="ts">
import { FButton } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";
</script>

<template>
    <section id="fbutton" aria-labelledby="fbutton-heading" class="demo">
        <component-heading id="fbutton-heading" :names="['FButton']" />
        <p class="demo__description">
            Knappar i de tre varianterna – primär för huvudåtgärden, sekundär
            för alternativ och tertiär för lägre prioriterade åtgärder – samt
            inaktiverade lägen.
        </p>
        <div class="demo-row">
            <f-button size="medium" variant="primary"> Primär </f-button>
            <f-button size="medium" variant="secondary"> Sekundär </f-button>
            <f-button size="medium" variant="tertiary"> Tertiär </f-button>
        </div>
        <div class="demo-row">
            <f-button size="medium" variant="primary" disabled> Primär, inaktiverad </f-button>
            <f-button size="medium" variant="secondary" disabled> Sekundär, inaktiverad </f-button>
            <f-button size="medium" variant="tertiary" disabled> Tertiär, inaktiverad </f-button>
        </div>
    </section>
</template>
