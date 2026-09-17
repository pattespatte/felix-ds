<script setup lang="ts">
import FFileSelectorDemo from "../demos/files/FFileSelectorDemo.vue";
import FFileItemDemo from "../demos/files/FFileItemDemo.vue";
import FileUploaderDemo from "../demos/files/FileUploaderDemo.vue";
</script>

<template>
    <div class="view">
        <h1>Filer</h1>
        <p class="view__intro">
            Filval, filvisning och uppladdningsmönstret från designpaketet.
        </p>

        <f-file-selector-demo />
        <f-file-item-demo />
        <file-uploader-demo />
    </div>
</template>
