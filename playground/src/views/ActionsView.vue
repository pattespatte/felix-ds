<script setup lang="ts">
import { FBadge, FLoader, FProgressbar } from "@fkui/vue";
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

        <!-- Tillfälliga grupper från v1 – flyttas till återkopplingsvyn i fas 3. -->
        <section id="fbadge" aria-labelledby="fbadge-heading" class="demo">
            <h2 id="fbadge-heading">FBadge</h2>
            <div class="demo-row">
                <f-badge> Standard </f-badge>
                <f-badge status="info"> Info </f-badge>
                <f-badge status="success"> Klart </f-badge>
                <f-badge status="warning"> Varning </f-badge>
                <f-badge status="error"> Fel </f-badge>
            </div>
        </section>

        <section id="fprogressbar" aria-labelledby="fprogressbar-heading" class="demo">
            <h2 id="fprogressbar-heading">FProgressbar och FLoader</h2>
            <f-progressbar :value="40" aria-label="Pågående förlopp"></f-progressbar>
            <f-loader />
        </section>
    </div>
</template>
