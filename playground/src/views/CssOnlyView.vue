<script setup lang="ts">
import AnchorDemo from "../demos/css/AnchorDemo.vue";
import ChipDemo from "../demos/css/ChipDemo.vue";
import CloseButtonDemo from "../demos/css/CloseButtonDemo.vue";
import ComboboxDemo from "../demos/css/ComboboxDemo.vue";
import EntrypointDemo from "../demos/css/EntrypointDemo.vue";
import IndentDemo from "../demos/css/IndentDemo.vue";
import SelectableItemDemo from "../demos/css/SelectableItemDemo.vue";
</script>

<template>
    <div class="view">
        <h1>Endast CSS</h1>
        <p class="view__intro">
            Komponenter utan eget Vue-API – ren markup med FKUI:s klasser.
            Där en komponent kräver formulärsfält (chip, selectable item)
            används FFieldset med de klasser SCSS-komponenten stylar.
        </p>

        <anchor-demo />
        <entrypoint-demo />
        <combobox-demo />
        <selectable-item-demo />
        <chip-demo />
        <close-button-demo />
        <indent-demo />
    </div>
</template>
