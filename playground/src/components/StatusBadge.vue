<script setup lang="ts">
import type { ComponentStatus } from "../componentStatus";

defineProps<{
    /** Status to render; the data lives in componentStatus.ts. */
    status: ComponentStatus;
}>();
</script>

<template>
    <!-- The classes are FKUI's own badge CSS: the inverted variant is the
         discrete style (tinted fill, positive border, primary text) and its
         tokens follow the active theme in both color modes. -->
    <span class="badge" :class="`badge--${status.variant}-inverted`">{{ status.label }}</span>
</template>
