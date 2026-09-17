<script setup lang="ts">
import FModalDemo from "../demos/modals/FModalDemo.vue";
import FConfirmModalDemo from "../demos/modals/FConfirmModalDemo.vue";
import FFormModalDemo from "../demos/modals/FFormModalDemo.vue";
import FContextMenuDemo from "../demos/modals/FContextMenuDemo.vue";
import FDialogueTreeDemo from "../demos/modals/FDialogueTreeDemo.vue";
</script>

<template>
    <div class="view">
        <h1>Modaler och dialoger</h1>
        <p class="view__intro">
            Dialoger: modal, bekräftelse, formulärmodal, snabbmeny och
            frågeträd.
        </p>

        <f-modal-demo />
        <f-confirm-modal-demo />
        <f-form-modal-demo />
        <f-context-menu-demo />
        <f-dialogue-tree-demo />
    </div>
</template>
