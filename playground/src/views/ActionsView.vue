<script setup lang="ts">
import FButtonDemo from "../demos/actions/FButtonDemo.vue";
import FCrudButtonDemo from "../demos/actions/FCrudButtonDemo.vue";
import FIconDemo from "../demos/actions/FIconDemo.vue";
import FLogoDemo from "../demos/actions/FLogoDemo.vue";
</script>

<template>
    <div class="view">
        <h1>Knappar och ikoner</h1>
        <p class="view__intro">
            Playground visar ett tunt temalager ovanpå FKUI:s publika npm-paket.
            Växla mellan FKUI:s grundtema och felix-temat med temaväljaren uppe
            till höger – alla komponenter byter utseende direkt, utan omladdning.
        </p>

        <f-button-demo />
        <f-crud-button-demo />
        <f-icon-demo />
        <f-logo-demo />
    </div>
</template>
