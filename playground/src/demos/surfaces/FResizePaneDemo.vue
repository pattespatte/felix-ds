<script setup lang="ts">
import { FResizePane } from "@fkui/vue";
</script>

<template>
    <section id="fresizepane" aria-labelledby="fresizepane-heading" class="demo">
        <h2 id="fresizepane-heading">FResizePane</h2>
        <p class="demo__description">
            Storleksändringsbart område – dra i handtaget mellan ytorna (eller
            fokusera det och använd piltangenter).
        </p>
        <!--
            FResizePane measures and sizes itself against the closest
            ce-page-layout ancestor and reads its area metadata from the
            --f-layout-* custom properties. The wrapper element below provides
            that context without pulling in the full page layout component.
        -->
        <ce-page-layout class="resize-demo">
            <f-resize-pane min="25%" max="75%" initial="40%">
                <div class="resize-demo__pane">Yta A – dra i handtaget</div>
            </f-resize-pane>
            <div class="resize-demo__pane resize-demo__pane--main">Yta B</div>
        </ce-page-layout>
    </section>
</template>

<style scoped lang="scss">
.resize-demo {
    display: flex;
    height: 12rem;
    border: 1px solid var(--fkds-color-border-weak, #d7d9e0);
    border-radius: var(--f-border-radius-medium, 8px);
    overflow: hidden;

    // Left-attached panel area: the values mirror the upstream left-panel
    // page layout and must be JSON strings (the component parses them).
    --f-layout-area: "left";
    --f-layout-panel: "left";
    --f-layout-direction: "column";
}

.resize-demo__pane {
    flex: 1;
    display: grid;
    place-items: center;
    color: var(--fkds-color-text-secondary, #585f71);
}
</style>
