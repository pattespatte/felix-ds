<script setup lang="ts">
import { FFixedPane } from "@fkui/vue";
</script>

<template>
    <section id="ffixedpane" aria-labelledby="ffixedpane-heading" class="demo">
        <h2 id="ffixedpane-heading">FFixedPane</h2>
        <p class="demo__description">
            Fast (oscrollbar) panel vid sidan av en scrollbar innehållsyta.
            Vänster kolumn scrollar inte – höger kolumn rullar.
        </p>
        <div class="fixed-pane-demo">
            <f-fixed-pane>
                <div class="static-panel">
                    <div class="static-panel__heading">
                        <i class="static-panel__icon f-icon f-icon-doc" aria-hidden="true"></i>
                        <span class="font-size--standard">Fast panel</span>
                    </div>
                    <div class="static-panel__content">
                        Informationen i den här kolumnen ligger still medan
                        innehållet bredvid scrollar.
                    </div>
                </div>
            </f-fixed-pane>
            <div class="fixed-pane-demo__scroll" tabindex="0">
                <ol>
                    <li v-for="n in 12" :key="n">Rad {{ n }} i scrollbart innehåll</li>
                </ol>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.fixed-pane-demo {
    display: flex;
    gap: 1rem;
    height: 14rem;
}

.fixed-pane-demo__scroll {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem 1rem;
    border: 1px solid var(--fkds-color-border-weak, #d7d9e0);
    border-radius: var(--f-border-radius-medium, 8px);
}

.fixed-pane-demo__scroll ol {
    margin: 0;
    padding-left: 1.25rem;
}
</style>
