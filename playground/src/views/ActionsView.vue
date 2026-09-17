<script setup lang="ts">
import { useTemplateRef } from "vue";
import {
    FBadge,
    FButton,
    FLoader,
    FMessageBox,
    FProgressbar,
    FTooltip,
} from "@fkui/vue";

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

        <section id="fbutton" aria-labelledby="fbutton-heading">
            <h2 id="fbutton-heading">Knappar</h2>
            <div class="demo-row">
                <f-button size="small" variant="primary"> Liten primär </f-button>
                <f-button size="small" variant="secondary"> Liten sekundär </f-button>
                <f-button size="small" variant="tertiary"> Liten tertiär </f-button>
            </div>
            <div class="demo-row">
                <f-button size="medium" variant="primary"> Primär </f-button>
                <f-button size="medium" variant="secondary"> Sekundär </f-button>
                <f-button size="medium" variant="tertiary"> Tertiär </f-button>
            </div>
            <div class="demo-row">
                <f-button size="large" variant="primary"> Stor primär </f-button>
                <f-button size="large" variant="secondary"> Stor sekundär </f-button>
                <f-button size="large" variant="tertiary"> Stor tertiär </f-button>
            </div>
        </section>

        <section id="fbadge" aria-labelledby="fbadge-heading">
            <h2 id="fbadge-heading">Brickor</h2>
            <div class="demo-row">
                <f-badge> Standard </f-badge>
                <f-badge status="info"> Info </f-badge>
                <f-badge status="success"> Klart </f-badge>
                <f-badge status="warning"> Varning </f-badge>
                <f-badge status="error"> Fel </f-badge>
            </div>
        </section>

        <section id="fmessagebox" aria-labelledby="fmessagebox-heading">
            <h2 id="fmessagebox-heading">Meddelanderutor</h2>
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

        <section id="ftooltip" aria-labelledby="ftooltip-heading">
            <h2 id="ftooltip-heading">Tooltip</h2>
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

        <section id="fprogressbar" aria-labelledby="fprogressbar-heading">
            <h2 id="fprogressbar-heading">Förlopp och läge</h2>
            <f-progressbar :value="40" aria-label="Pågående förlopp"></f-progressbar>
            <f-loader />
        </section>
    </div>
</template>

<style scoped lang="scss">
section {
    margin-top: 2.5rem;
}

h3 {
    margin: 0;
}

.demo-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 1rem;
}

f-message-box {
    display: block;
    margin-bottom: 1rem;
}
</style>
