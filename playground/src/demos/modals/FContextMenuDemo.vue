<script setup lang="ts">
import { ref } from "vue";
import { FButton, FContextMenu } from "@fkui/vue";

const isOpen = ref(false);
const selected = ref("");
const anchor = ref<HTMLElement>();

const items = [
    { key: "open", label: "Öppna" },
    { key: "rename", label: "Byt namn" },
    { key: "delete", label: "Ta bort" },
];

function onClick(): void {
    isOpen.value = true;
}

function onClose(): void {
    isOpen.value = false;
}

function onSelect(item: unknown): void {
    selected.value = (item as { label: string }).label;
    isOpen.value = false;
}
</script>

<template>
    <section id="fcontextmenu" aria-labelledby="fcontextmenu-heading" class="demo">
        <h2 id="fcontextmenu-heading">FContextMenu</h2>
        <p class="demo__description">
            Snabbmeny som öppnas vid en ankarpunkt – klicka på knappen.
        </p>
        <span ref="anchor" class="context-menu-demo__anchor">
            <f-button aria-haspopup="menu" size="medium" variant="secondary" @click="onClick">
                Åtgärder
            </f-button>
        </span>
        <p v-if="selected">Valt: {{ selected }}</p>

        <f-context-menu
            :is-open="isOpen"
            :items="items"
            :anchor="anchor"
            @close="onClose"
            @select="onSelect"
        />
    </section>
</template>

<style scoped lang="scss">
.context-menu-demo__anchor {
    display: inline-block;
}
</style>
