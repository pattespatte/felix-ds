<script setup lang="ts">
import FNavigationMenuDemo from "../demos/navigation/FNavigationMenuDemo.vue";
import FPageLayoutDemo from "../demos/navigation/FPageLayoutDemo.vue";
import FLayoutRightPanelDemo from "../demos/navigation/FLayoutRightPanelDemo.vue";
</script>

<template>
    <div class="view">
        <h1>Navigation och layout</h1>
        <p class="view__intro">
            Navigations- och layoutkomponenter. Själva app skalet demonstrerar
            redan FPageHeader, FLayoutApplicationTemplate, FLayoutLeftPanel och
            det SCSS-baserade layout-navigation-mönstret – det visas löpande i
            vänsterkolumnen.
        </p>

        <f-navigation-menu-demo />
        <f-page-layout-demo />
        <f-layout-right-panel-demo />
    </div>
</template>
