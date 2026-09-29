<script setup lang="ts">
import { FMessageBox } from "@fkui/vue";
import ComponentHeading from "../../components/ComponentHeading.vue";
</script>

<template>
    <section id="fmessagebox" aria-labelledby="fmessagebox-heading" class="demo">
        <component-heading id="fmessagebox-heading" :names="['FMessageBox']" />
        <p class="demo__description">
            Meddelanderutor i de fyra typerna – information, bekräftelse,
            varning och fel.
        </p>
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
</template>

<style scoped lang="scss">
f-message-box {
    display: block;
    margin-bottom: 1rem;
}
</style>
