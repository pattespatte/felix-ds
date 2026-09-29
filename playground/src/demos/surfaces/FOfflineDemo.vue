<script setup lang="ts">
import { ref } from "vue";
import { FButton, FOffline } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";

const isOffline = ref(false);

function toggle(): void {
    isOffline.value = !isOffline.value;
    window.dispatchEvent(new Event(isOffline.value ? "offline" : "online"));
}
</script>

<template>
    <section id="foffline" aria-labelledby="foffline-heading" class="demo">
        <component-heading id="foffline-heading" :names="['FOffline']" />
        <p class="demo__description">
            Meddelandebanderoll när uppkopplingen försvinner. Demon simulerar
            händelsen (i en riktiga applikation kommer den från webbläsaren,
            t.ex. via utvecklarverktygens nätverksinställningar).
        </p>
        <f-offline>
            Det verkar som att du inte har någon internetuppkoppling just nu.
            Tänk på att sparning kräver uppkoppling.
        </f-offline>
        <f-button size="medium" variant="secondary" @click="toggle">
            {{ isOffline ? "Simulera uppkoppling" : "Simulera avbrott" }}
        </f-button>
    </section>
</template>
