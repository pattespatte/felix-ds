<script setup lang="ts">
import { FIcon } from "@fkui/vue";

const icons = [
    { name: "bell", label: "bell" },
    { name: "calendar", label: "calendar" },
    { name: "search", label: "search" },
    { name: "plus", label: "plus" },
    { name: "pen", label: "pen" },
    { name: "trashcan", label: "trashcan" },
    { name: "success", label: "success" },
    { name: "error", label: "error" },
    { name: "alert", label: "alert" },
    { name: "pdf", label: "pdf" },
    { name: "arrow-right", label: "arrow-right" },
    { name: "new-window", label: "new-window" },
];
</script>

<template>
    <section id="ficon" aria-labelledby="ficon-heading" class="demo">
        <h2 id="ficon-heading">FIcon</h2>
        <p class="demo__description">
            Ett urval ur standardikonbiblioteket. Ikonerna är teckensnittsbaserade
            och följer textfärgen i det aktiva temat.
        </p>
        <ul class="icon-grid">
            <li v-for="icon in icons" :key="icon.name" class="icon-grid__item">
                <f-icon :name="icon.name" />
                <span class="icon-grid__label">{{ icon.label }}</span>
            </li>
        </ul>
    </section>
</template>

<style scoped lang="scss">
.icon-grid {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
    gap: 0.75rem;
    max-width: 40rem;
}

.icon-grid__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0.5rem;
    border: 1px solid var(--fkds-color-border-weak, #d7d9e0);
    border-radius: var(--f-border-radius-medium, 8px);
    font-size: 1.5rem;
}

.icon-grid__label {
    font-size: var(--f-font-size-small, 0.875rem);
    color: var(--fkds-color-text-secondary, #585f71);
}
</style>
