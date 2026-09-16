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
    <section id="actions" aria-labelledby="actions-heading">
        <h2 id="actions-heading">Knappar och återkoppling</h2>

        <h3>Knappar</h3>
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

        <h3>Brickor</h3>
        <div class="demo-row">
            <f-badge> Standard </f-badge>
            <f-badge status="info"> Info </f-badge>
            <f-badge status="success"> Klart </f-badge>
            <f-badge status="warning"> Varning </f-badge>
            <f-badge status="error"> Fel </f-badge>
        </div>

        <h3>Meddelanderutor</h3>
        <f-message-box type="info">
            <template #default="{ headingSlotClass }">
                <h2 :class="headingSlotClass">Informationsmeddelande</h2>
                <p>Ren information utan krav på åtgärd.</p>
            </template>
        </f-message-box>
        <f-message-box type="success">
            <template #default="{ headingSlotClass }">
                <h2 :class="headingSlotClass">Bekräftelse</h2>
                <p>Åtgärden genomfördes utan fel.</p>
            </template>
        </f-message-box>
        <f-message-box type="warning">
            <template #default="{ headingSlotClass }">
                <h2 :class="headingSlotClass">Varning</h2>
                <p>Kontrollera uppgifterna innan du fortsätter.</p>
            </template>
        </f-message-box>
        <f-message-box type="error">
            <template #default="{ headingSlotClass }">
                <h2 :class="headingSlotClass">Felmeddelande</h2>
                <p>Något gick fel. Försök igen.</p>
            </template>
        </f-message-box>

        <h3>Tooltip</h3>
        <div ref="tooltip-heading">
            <h4>Rubrik med tooltip</h4>
        </div>
        <f-tooltip
            :attach-to="tooltipHeading"
            screen-reader-text="Information om rubriken med tooltip"
            header-tag="h5"
        >
            <template #header> Om rubriken </template>
            <template #body>
                Detta är en tooltip som visar mer detaljerad information än vad
                som får plats i etiketten.
            </template>
        </f-tooltip>

        <h3>Förlopp och läge</h3>
        <f-progressbar :value="40" aria-label="Pågående förlopp"></f-progressbar>
        <f-loader />
    </section>
</template>

<style scoped lang="scss">
h3 {
    margin-top: 2rem;
}

h4 {
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
    margin-bottom: 1rem;
}
</style>
