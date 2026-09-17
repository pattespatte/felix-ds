<script setup lang="ts">
import { FMinimizablePanel } from "@fkui/vue";
</script>

<template>
    <section id="fminimizablepanel" aria-labelledby="fminimizablepanel-heading" class="demo">
        <h2 id="fminimizablepanel-heading">FMinimizablePanel</h2>
        <p class="demo__description">
            Panel som kan minimeras till en smal list – klicka på pilen i
            panelens huvud.
        </p>
        <div class="minimizable-demo">
            <f-minimizable-panel>
                <template #default="panelScope">
                    <template v-if="panelScope.isOpen">
                        <h3 :slot="panelScope.header">Filter</h3>
                        <div :slot="panelScope.content">
                            Panelinnehåll som visas när panelen är öppen.
                        </div>
                        <div :slot="panelScope.footer">
                            <span>Panelfot</span>
                        </div>
                    </template>
                </template>
            </f-minimizable-panel>
            <div class="minimizable-demo__main">Huvudinnehåll</div>
        </div>
    </section>
</template>

<style scoped lang="scss">
// Explicit height so the panel and its toggle are usable (the panel is
// designed for application layouts, not flowing pages).
.minimizable-demo {
    display: flex;
    height: 16rem;
    border: 1px solid var(--fkds-color-border-weak, #d7d9e0);
    border-radius: var(--f-border-radius-medium, 8px);
    overflow: hidden;
}

.minimizable-demo__main {
    flex: 1;
    display: grid;
    place-items: center;
    color: var(--fkds-color-text-secondary, #585f71);
}
</style>
