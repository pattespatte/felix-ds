<script setup lang="ts">
import FDataTableDemo from "../demos/tables/FDataTableDemo.vue";
import FInteractiveTableDemo from "../demos/tables/FInteractiveTableDemo.vue";
import FTableDemo from "../demos/tables/FTableDemo.vue";
</script>

<template>
    <div class="view">
        <h1>Tabeller och data</h1>
        <p class="view__intro">
            Tabeller för visning och interaktion, samt komponenter som
            sorterar, filtrerar, paginerar och redigerar datamängder.
        </p>

        <f-table-demo />
        <f-data-table-demo />
        <f-interactive-table-demo />
    </div>
</template>
