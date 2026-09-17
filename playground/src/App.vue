<script setup lang="ts">
import { computed, type Component } from "vue";
import { FLayoutApplicationTemplate, FLayoutLeftPanel, FPageHeader } from "@fkui/vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import PageFooter from "./components/PageFooter.vue";
import NavTree from "./components/NavTree.vue";
import { currentRoute } from "./router";
import StartView from "./views/StartView.vue";
import ActionsView from "./views/ActionsView.vue";
import FormsView from "./views/FormsView.vue";
import CalendarView from "./views/CalendarView.vue";
import FilesView from "./views/FilesView.vue";
import SurfacesView from "./views/SurfacesView.vue";
import ModalsView from "./views/ModalsView.vue";
import NavigationView from "./views/NavigationView.vue";
import TablesView from "./views/TablesView.vue";
import FeedbackView from "./views/FeedbackView.vue";
import WizardView from "./views/WizardView.vue";
import CssOnlyView from "./views/CssOnlyView.vue";

// Slugs mirror navigation.ts; the lookup makes unknown routes impossible
// (router normalises) but falls back to the first view regardless.
const viewComponents: Record<string, Component> = {
    start: StartView,
    knappar: ActionsView,
    formular: FormsView,
    kalender: CalendarView,
    filer: FilesView,
    ytor: SurfacesView,
    modaler: ModalsView,
    navigation: NavigationView,
    tabeller: TablesView,
    aterkoppling: FeedbackView,
    wizard: WizardView,
    css: CssOnlyView,
};

const currentViewComponent = computed<Component>(
    () => viewComponents[currentRoute.value.slug] ?? ActionsView,
);
</script>

<template>
    <!-- FLayoutApplicationTemplate renders the header/footer landmarks around
         its slots, so FPageHeader and PageFooter need no wrapper elements of
         their own. -->
    <f-layout-application-template>
        <template #header>
            <f-page-header>
                <a class="app-title-link" href="#/start"
                    >felix-ds<span class="app-name-sub"> – playground</span></a
                >
                <template #right>
                    <theme-toggle />
                </template>
            </f-page-header>
        </template>

        <f-layout-left-panel nav-label="Komponenter" initial-width="320">
            <template #heading>
                <p class="shell-nav-title">Komponenter</p>
            </template>
            <template #content>
                <nav-tree />
            </template>
            <template #default>
                <component :is="currentViewComponent" />
            </template>
        </f-layout-left-panel>

        <template #footer>
            <page-footer />
        </template>
    </f-layout-application-template>
</template>

<style scoped lang="scss">
// The header title doubles as the home link (same behaviour as the
// reference site's logotype): styled as plain text, keyboard focus ring kept.
.app-title-link {
    color: inherit;
    text-decoration: none;
}

.app-title-link:focus-visible {
    outline: none;
    box-shadow: var(--f-focus-box-shadow);
}

.app-name-sub {
    font-weight: var(--f-font-weight-normal, 400);
}

.shell-nav-title {
    margin: 0;
    padding: 0.5rem 0.25rem;
    font-size: var(--f-font-size-h3, 1.25rem);
    font-weight: var(--f-font-weight-bold, 600);
    color: var(--fkds-color-text-primary, #1b1e23);
}
</style>
