<script setup lang="ts">
import { ref } from "vue";
import { FFileItem, FFileSelector, FMessageBox } from "@fkui/vue";

const files = ref<{ name: string; mime: string }[]>([]);
const error = ref("");

function onChange(event: FileList): void {
    error.value = "";
    for (const file of Array.from(event)) {
        if (file.size > 5 * 1024 * 1024) {
            error.value = `${file.name} är för stor (max 5 MB).`;
            continue;
        }
        files.value.push({ name: file.name, mime: file.type || "application/octet-stream" });
    }
}

function remove(index: number): void {
    files.value.splice(index, 1);
}
</script>

<template>
    <section id="file-uploader" aria-labelledby="file-uploader-heading" class="demo">
        <h2 id="file-uploader-heading">file-uploader (SCSS-only)</h2>
        <p class="demo__description">
            Mönstret <code>file-uploader</code> från designpaketet saknar
            Vue-komponent – det är en CSS-klass som ger meddelanderutan i en
            uppladdare extra avstånd. Wrappern här är handskriven markup med
            klassen; innehållet composed av filväljare, meddelanderuta och filrader.
        </p>
        <div class="file-uploader">
            <f-file-selector accept="application/pdf, image/jpeg, image/png" @change="onChange">
                Ladda upp fil
            </f-file-selector>

            <f-message-box v-if="error" type="error" class="file-uploader__message-box">
                <template #default="{ headingSlotClass }">
                    <h3 :class="headingSlotClass">Filen kunde inte laddas upp</h3>
                    <p>{{ error }}</p>
                </template>
            </f-message-box>

            <f-file-item
                v-for="(file, index) in files"
                :key="file.name"
                :file-name="file.name"
                :mime-type="file.mime"
            >
                <template #row>
                    <button
                        class="file-uploader-demo__remove"
                        type="button"
                        @click="remove(index)"
                    >
                        Ta bort {{ file.name }}
                    </button>
                </template>
            </f-file-item>
        </div>
    </section>
</template>

<style scoped lang="scss">
.file-uploader-demo__remove {
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    color: var(--fkds-color-action-text-primary-default, #0865ae);
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
}

.file-uploader-demo__remove:hover {
    text-decoration: none;
}

.file-uploader-demo__remove:focus-visible {
    outline: none;
    box-shadow: var(--f-focus-box-shadow);
}
</style>
