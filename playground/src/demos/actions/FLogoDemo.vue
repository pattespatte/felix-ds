<script setup lang="ts">
import { FLogo } from "@fkui/vue";
</script>

<template>
    <section id="flogo" aria-labelledby="flogo-heading" class="demo">
        <h2 id="flogo-heading">FLogo</h2>
        <p class="demo__description">
            Logotypkomponenten visar sin bild via CSS-variablerna
            <code>--f-logo-image-small</code> och <code>--f-logo-image-large</code>.
            Temalagret tillhandahåller en neutral platsmarkör (en fylld cirkel) –
            i FKUI:s grundtema är ingen logotyp installerad. Textinnehållet blir
            komponentens tillgänglighetsnamn.
        </p>
        <div class="demo-row logo-demo-row">
            <f-logo size="small"> Temats platsmarkör, liten </f-logo>
            <f-logo size="large"> Temats platsmarkör, stor </f-logo>
        </div>
    </section>
</template>

<style scoped lang="scss">
.logo-demo-row {
    align-items: flex-end;
    padding: 1rem;
    border: 1px solid var(--fkds-color-border-weak, #d7d9e0);
    border-radius: var(--f-border-radius-medium, 8px);
    max-width: 40rem;
}
</style>
