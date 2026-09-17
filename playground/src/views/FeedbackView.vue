<script setup lang="ts">
import FBadgeDemo from "../demos/feedback/FBadgeDemo.vue";
import FLoaderDemo from "../demos/feedback/FLoaderDemo.vue";
import FProgressbarDemo from "../demos/feedback/FProgressbarDemo.vue";
</script>

<template>
    <div class="view">
        <h1>Återkoppling och status</h1>
        <p class="view__intro">
            Statusbrickor, snurror och förloppsindikatorer.
        </p>

        <f-badge-demo />
        <f-loader-demo />
        <f-progressbar-demo />
    </div>
</template>
