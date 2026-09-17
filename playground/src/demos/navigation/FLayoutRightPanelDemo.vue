<script setup lang="ts">
import { ref } from "vue";
import { FButton, FLayoutRightPanel, FLayoutRightPanelService } from "@fkui/vue";

const items = [
    { title: "Aktiviteter", text: "Planerade aktiviteter för veckan." },
    { title: "Påminnelser", text: "Kommande påminnelser och deadlines." },
];

const selectedTitle = ref("");
const selectedText = ref("");

function openPanel(item: { title: string; text: string }): void {
    selectedTitle.value = item.title;
    selectedText.value = item.text;
    FLayoutRightPanelService.open();
}

function closePanel(): void {
    FLayoutRightPanelService.close();
}
</script>

<template>
    <section id="flayoutrightpanel" aria-labelledby="flayoutrightpanel-heading" class="demo">
        <h2 id="flayoutrightpanel-heading">FLayoutRightPanel</h2>
        <p class="demo__description">
            Högerpanel som öppnas vid behov – klicka på ett ämne i listan.
        </p>
        <f-layout-right-panel>
            <template #heading>
                <h3>{{ selectedTitle }}</h3>
            </template>
            <template #content>
                <p>{{ selectedText }}</p>
                <f-button size="medium" variant="secondary" @click="closePanel()">
                    Stäng
                </f-button>
            </template>
            <template #default>
                <ul class="right-panel-demo__list">
                    <li v-for="item in items" :key="item.title">
                        <button
                            class="right-panel-demo__link"
                            type="button"
                            @click="openPanel(item)"
                        >
                            {{ item.title }}
                        </button>
                    </li>
                </ul>
            </template>
        </f-layout-right-panel>
    </section>
</template>

<style scoped lang="scss">
.right-panel-demo__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.5rem;
}

.right-panel-demo__link {
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    color: var(--fkds-color-action-text-primary-default, #0865ae);
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
}

.right-panel-demo__link:hover {
    text-decoration: none;
}

.right-panel-demo__link:focus-visible {
    outline: none;
    box-shadow: var(--f-focus-box-shadow);
}
</style>
