<script setup lang="ts">
import { ref } from "vue";
import { FFileSelector } from "@fkui/vue";

const senasteFil = ref("");
const accept = "application/pdf, image/jpeg, image/png";

function onChange(files: FileList): void {
    senasteFil.value = files.length > 0 ? files[0]?.name ?? "" : "";
}
</script>

<template>
    <section id="ffileselector" aria-labelledby="ffileselector-heading" class="demo">
        <h2 id="ffileselector-heading">FFileSelector</h2>
        <p class="demo__description">
            Filväljarknapp som öppnar systemets filval. Välj en fil för att se
            namnet här under.
        </p>
        <f-file-selector :accept @change="onChange"> Lägg till fil </f-file-selector>
        <p v-if="senasteFil" class="file-selector-demo__picked">
            Vald fil: {{ senasteFil }}
        </p>
    </section>
</template>

<style scoped lang="scss">
.file-selector-demo__picked {
    margin-top: 0.75rem;
    color: var(--fkds-color-text-secondary, #585f71);
}
</style>
