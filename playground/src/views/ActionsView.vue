<script setup lang="ts">
import { useTemplateRef } from "vue";
import {
    FBadge,
    FLoader,
    FMessageBox,
    FProgressbar,
    FTooltip,
} from "@fkui/vue";
import FButtonDemo from "../demos/actions/FButtonDemo.vue";
import FCrudButtonDemo from "../demos/actions/FCrudButtonDemo.vue";
import FIconDemo from "../demos/actions/FIconDemo.vue";
import FLogoDemo from "../demos/actions/FLogoDemo.vue";

const tooltipHeading = useTemplateRef<HTMLDivElement>("tooltip-heading");
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

        <!-- Tillfälliga grupper från v1 – flyttas till sina vyer i fas 3. -->
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

        <section id="fmessagebox" aria-labelledby="fmessagebox-heading" class="demo">
            <h2 id="fmessagebox-heading">FMessageBox</h2>
            <f-message-box type="info">
                <template #default="{ headingSlotClass }">
                    <h3 :class="headingSlotClass">Informationsmeddelande</h3>
                    <p>Ren information utan krav på åtgärd.</p>
                </template>
            </f-message-box>
            <f-message-box type="success">
                <template #default="{ headingSlotClass }">
                    <h3 :class="headingSlotClass">Bekräftelse</h3>
                    <p>Åtgärden genomfördes utan fel.</p>
                </template>
            </f-message-box>
            <f-message-box type="warning">
                <template #default="{ headingSlotClass }">
                    <h3 :class="headingSlotClass">Varning</h3>
                    <p>Kontrollera uppgifterna innan du fortsätter.</p>
                </template>
            </f-message-box>
            <f-message-box type="error">
                <template #default="{ headingSlotClass }">
                    <h3 :class="headingSlotClass">Felmeddelande</h3>
                    <p>Något gick fel. Försök igen.</p>
                </template>
            </f-message-box>
        </section>

        <section id="ftooltip" aria-labelledby="ftooltip-heading" class="demo">
            <h2 id="ftooltip-heading">FTooltip</h2>
            <div ref="tooltip-heading">
                <h3>Rubrik med tooltip</h3>
            </div>
            <f-tooltip
                :attach-to="tooltipHeading"
                screen-reader-text="Information om rubriken med tooltip"
                header-tag="h4"
            >
                <template #header> Om rubriken </template>
                <template #body>
                    Detta är en tooltip som visar mer detaljerad information än vad
                    som får plats i etiketten.
                </template>
            </f-tooltip>
        </section>

        <section id="fprogressbar" aria-labelledby="fprogressbar-heading" class="demo">
            <h2 id="fprogressbar-heading">FProgressbar och FLoader</h2>
            <f-progressbar :value="40" aria-label="Pågående förlopp"></f-progressbar>
            <f-loader />
        </section>
    </div>
</template>

<style scoped lang="scss">
h3 {
    margin: 0;
}

f-message-box {
    display: block;
    margin-bottom: 1rem;
}
</style>
