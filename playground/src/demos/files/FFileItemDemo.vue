<script setup lang="ts">
import { ref } from "vue";
import { FFileItem } from "@fkui/vue";

const files = ref([
    { name: "rapport.pdf", mime: "application/pdf" },
    { name: "foto.jpeg", mime: "image/jpeg" },
]);

function remove(index: number): void {
    files.value.splice(index, 1);
}
</script>

<template>
    <section id="ffileitem" aria-labelledby="ffileitem-heading" class="demo">
        <h2 id="ffileitem-heading">FFileItem</h2>
        <p class="demo__description">
            Filrader med ikon utifrån filtyp och en åtgärd per fil.
        </p>
        <f-file-item
            v-for="(file, index) in files"
            :key="file.name"
            :file-name="file.name"
            :mime-type="file.mime"
        >
            <template #row>
                <button
                    class="file-item-demo__remove"
                    type="button"
                    @click="remove(index)"
                >
                    Ta bort {{ file.name }}
                </button>
            </template>
        </f-file-item>
        <p v-if="files.length === 0" class="file-item-demo__empty">
            Alla filer borttagna – ladda om sidan för att återställa demon.
        </p>
    </section>
</template>

<style scoped lang="scss">
.file-item-demo__remove {
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    color: var(--fkds-color-action-text-primary-default, #0865ae);
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
}

.file-item-demo__remove:hover {
    text-decoration: none;
}

.file-item-demo__remove:focus-visible {
    outline: none;
    box-shadow: var(--f-focus-box-shadow);
}

.file-item-demo__empty {
    color: var(--fkds-color-text-secondary, #585f71);
}
</style>
