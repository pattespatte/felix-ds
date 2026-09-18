<script setup lang="ts">
import FCrudDatasetDemo from "../demos/tables/FCrudDatasetDemo.vue";
import FDataTableDemo from "../demos/tables/FDataTableDemo.vue";
import FDefinitionListDemo from "../demos/tables/FDefinitionListDemo.vue";
import FInteractiveTableDemo from "../demos/tables/FInteractiveTableDemo.vue";
import FListDemo from "../demos/tables/FListDemo.vue";
import FPaginateDatasetDemo from "../demos/tables/FPaginateDatasetDemo.vue";
import FPaginatorDemo from "../demos/tables/FPaginatorDemo.vue";
import FSortFilterDatasetDemo from "../demos/tables/FSortFilterDatasetDemo.vue";
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
        <f-crud-dataset-demo />
        <f-sort-filter-dataset-demo />
        <f-paginate-dataset-demo />
        <f-paginator-demo />
        <f-list-demo />
        <f-definition-list-demo />
    </div>
</template>
