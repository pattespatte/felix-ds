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
        <div class="resize-demo">
            <f-resize-pane min="25%" max="75%" initial="40%">
                <div class="resize-demo__pane">Yta A – dra i handtaget</div>
            </f-resize-pane>
            <div class="resize-demo__pane resize-demo__pane--main">Yta B</div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.resize-demo {
    display: flex;
    height: 12rem;
    border: 1px solid var(--fkds-color-border-weak, #d7d9e0);
    border-radius: var(--f-border-radius-medium, 8px);
    overflow: hidden;
}

.resize-demo__pane {
    flex: 1;
    display: grid;
    place-items: center;
    color: var(--fkds-color-text-secondary, #585f71);
}
</style>
