<script setup lang="ts">
import { ref } from "vue";
import {
    FTextField,
    FWizard,
    FWizardStep,
    FWizardStepAction,
    type FWizardValidationCallback,
} from "@fkui/vue";

const current = ref<string | undefined>(undefined);
const namn = ref("");
const epost = ref("");
const klar = ref(false);

// FWizardStepAction är api:t för att styra navigeringen från before-next:
// CONTINUE låter steget valideras och gå vidare, CANCEL håller kvar.
const beforeNext: FWizardValidationCallback = () => {
    return FWizardStepAction.CONTINUE;
};

function onCompleted(): void {
    klar.value = true;
}
</script>

<template>
    <section id="fwizard" aria-labelledby="fwizard-heading" class="demo">
        <h2 id="fwizard-heading">FWizard, FWizardStep och FWizardStepAction</h2>
        <p class="demo__description">
            Stegvis flöde i tre steg med validering per steg – fyll i båda
            fälten och gå vidare till granskning och bekräftelse.
        </p>

        <p v-if="klar">Tack, {{ namn }}! Din anmälan är registrerad.</p>

        <f-wizard
            v-else
            v-model="current"
            header-tag="h2"
            disable-initial-focus
            @completed="onCompleted"
        >
            <f-wizard-step key="kontakt" title="Kontaktuppgifter">
                <f-text-field v-model="namn" v-validation.required :maxlength="100">
                    Namn
                </f-text-field>
                <f-text-field v-model="epost" v-validation.required.email :maxlength="100">
                    E-postadress
                </f-text-field>
            </f-wizard-step>

            <f-wizard-step key="granska" title="Granska" :before-next="beforeNext">
                <dl class="wizard-demo__summary">
                    <div>
                        <dt>Namn</dt>
                        <dd>{{ namn }}</dd>
                    </div>
                    <div>
                        <dt>E-postadress</dt>
                        <dd>{{ epost }}</dd>
                    </div>
                </dl>
            </f-wizard-step>

            <f-wizard-step key="klart" title="Klart">
                <p>
                    Kontrollera att uppgifterna stämmer och bekräfta anmälan i
                    sista steget.
                </p>
            </f-wizard-step>
        </f-wizard>
    </section>
</template>

<style scoped lang="scss">
.wizard-demo__summary {
    margin: 0;

    div {
        display: flex;
        gap: 1rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--fkds-color-border-weak, #d7d9e0);
    }

    dt {
        flex: none;
        width: 8rem;
        font-weight: var(--f-font-weight-bold, 600);
    }

    dd {
        margin: 0;
    }
}
</style>
