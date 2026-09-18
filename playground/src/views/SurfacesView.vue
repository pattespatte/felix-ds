<script setup lang="ts">
import FCardDemo from "../demos/surfaces/FCardDemo.vue";
import FExpandDemo from "../demos/surfaces/FExpandDemo.vue";
import FExpandablePanelDemo from "../demos/surfaces/FExpandablePanelDemo.vue";
import FExpandableParagraphDemo from "../demos/surfaces/FExpandableParagraphDemo.vue";
import FMessageBoxDemo from "../demos/surfaces/FMessageBoxDemo.vue";
import FTooltipDemo from "../demos/surfaces/FTooltipDemo.vue";
import FDetailsPanelDemo from "../demos/surfaces/FDetailsPanelDemo.vue";
import FMinimizablePanelDemo from "../demos/surfaces/FMinimizablePanelDemo.vue";
import FFixedPaneDemo from "../demos/surfaces/FFixedPaneDemo.vue";
import FResizePaneDemo from "../demos/surfaces/FResizePaneDemo.vue";
import FOfflineDemo from "../demos/surfaces/FOfflineDemo.vue";
</script>

<template>
    <div class="view">
        <h1>Ytor och paneler</h1>
        <p class="view__intro">
            Ytor som samlar innehåll: kort, expanderbara ytor, meddelanden,
            paneler och lägesbandoller.
        </p>

        <f-card-demo />
        <f-expand-demo />
        <f-expandable-panel-demo />
        <f-expandable-paragraph-demo />
        <f-message-box-demo />
        <f-tooltip-demo />
        <f-details-panel-demo />
        <f-minimizable-panel-demo />
        <f-fixed-pane-demo />
        <f-resize-pane-demo />
        <f-offline-demo />
    </div>
</template>
