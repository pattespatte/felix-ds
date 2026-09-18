<script setup lang="ts">
import { FDefinitionList } from "@fkui/vue";
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

const definitions = [
    { term: "Version", definition: "0.1.0 (proof of concept)" },
    { term: "Temamodell", definition: "CSS-variabler ovanpå FKUI:s npm-paket" },
    { term: "Typografi", definition: "Noto Sans (text), Roboto Slab (rubriker)" },
];
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

        <!-- Tillfällig grupp från v1 – flyttas till tabellvyn i nästa task. -->
        <section id="fdefinitionlist" aria-labelledby="fdefinitionlist-heading" class="demo">
            <h2 id="fdefinitionlist-heading">FDefinitionList</h2>
            <f-definition-list :definitions />
        </section>

    </div>
</template>
