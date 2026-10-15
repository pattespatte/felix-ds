<script setup lang="ts">
import { computed, onMounted, provide, ref, type Component } from "vue";
import { FLayoutApplicationTemplate, FLayoutLeftPanel, FPageHeader } from "@fkui/vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import ColorModeToggle from "./components/ColorModeToggle.vue";
import PageFooter from "./components/PageFooter.vue";
import NavTree from "./components/NavTree.vue";
import { currentRoute } from "./router";
import StartView from "./views/StartView.vue";
import GettingStartedView from "./views/GettingStartedView.vue";
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
    "kom-igang": GettingStartedView,
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

// Same breakpoint as the header rules in main.scss (FKUI medium, 640px).
const MOBILE = "(max-width: 39.99em)";

// FLayoutLeftPanel keeps its open state internal (no prop upstream) and
// mounts open at its full pixel width – on a phone that covers nearly the
// whole viewport, since the panel's 50%-viewport clamp only runs on window
// resize, never on load. Flipping the state directly runs before first
// paint, so phones never see the open panel.
const leftPanel = ref<InstanceType<typeof FLayoutLeftPanel> | null>(null);
const mobileViewport = window.matchMedia(MOBILE);

// Shared close callback: used at mount (collapse on small screens), by the
// scrim's click handler and by NavTree after a navigation. On desktop it is
// a no-op – the panel there is a permanent column, not a drawer.
function closeMobileNav(): void {
    if (mobileViewport.matches && leftPanel.value?.isOpen) {
        leftPanel.value.isOpen = false;
    }
}

onMounted(closeMobileNav);
provide("close-mobile-nav", closeMobileNav);
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
                    <div class="header-controls">
                        <theme-toggle />
                        <color-mode-toggle />
                    </div>
                </template>
            </f-page-header>
        </template>

        <f-layout-left-panel ref="leftPanel" nav-label="Komponenter" initial-width="320">
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

    <!-- Backdrop behind the open navigation drawer on small screens; kept
         inert by CSS (main.scss) everywhere else. -->
    <div class="mobile-nav-scrim" aria-hidden="true" @click="closeMobileNav()"></div>
</template>

<style scoped lang="scss">
// Header controls row: theme profile pill + color mode icon button.
.header-controls {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

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
