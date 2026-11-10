<script setup lang="ts">
import { FIcon } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";
import { PHOSPHOR_ICON_NAMES } from "../../../../src/icons/phosphor-spritesheet";

/**
 * Namn som döljs ur rutnätet men finns kvar i spriten: FKUI-komponenter
 * (t.ex. sökfältets tömningsknapp) ritar cross själva, och den delar
 * teckning med close – att visa båga två ger två identiska rutor.
 */
const HIDDEN_ICON_NAMES: ReadonlySet<string> = new Set(["cross"]);

const visibleIconNames: readonly string[] = PHOSPHOR_ICON_NAMES.filter(
    (name) => !HIDDEN_ICON_NAMES.has(name),
);
</script>

<template>
    <section id="ficon" aria-labelledby="ficon-heading" class="demo">
        <component-heading id="ficon-heading" :names="['FIcon']" />
        <p class="demo__description">
            felix-temats ikonuppsättning – Phosphor Icons i vikten bold. Ikonerna är
            SVG-spritebaserade, ersätter standardikonbibliotekets presentation bakom
            oförändrade FIcon-namn och följer textfärgen i det aktiva temat.
            <code>cross</code> döljs ur listan – den delar teckning med
            <code>close</code> men finns kvar i spriten för FKUI:s interna användning.
        </p>
        <ul class="icon-grid">
            <li v-for="name in visibleIconNames" :key="name" class="icon-grid__item">
                <f-icon :name="name" />
                <span class="icon-grid__label">{{ name }}</span>
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
