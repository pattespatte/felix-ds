<script setup lang="ts">
import { FButton, FDetailsPanel, FTextField, useDetailsPanel } from "@fkui/vue";

interface Activity {
    id: number;
    name: string;
}

const name = "activity-details-panel";
const panel = useDetailsPanel<Activity>(name);
const DetailsPanel = FDetailsPanel<Activity>;

const activity = { id: 1, name: "Förbereda veckomöte" };

function openPanel(): void {
    panel.open({ ...activity }, {
        onClose({ reason, item }) {
            if (reason === "save") {
                activity.name = item.name;
            }
        },
    });
}
</script>

<template>
    <section id="fdetailspanel" aria-labelledby="fdetailspanel-heading" class="demo">
        <h2 id="fdetailspanel-heading">FDetailsPanel</h2>
        <p class="demo__description">
            Detaljpanel som visas som en utfällbar yta. Öppna panelen, ändra
            namnet och spara – stäng med Esc eller stängknappen.
        </p>
        <p>Aktuell aktivitet: {{ activity.name }}</p>
        <f-button size="medium" variant="secondary" @click="openPanel">
            Ändra aktivitet
        </f-button>

        <details-panel :name>
            <template #default="panelScope">
                <h3 :slot="panelScope.header"> Ändra aktivitet </h3>
                <div :slot="panelScope.content">
                    <f-text-field v-model="panelScope.item.name"> Aktivitet </f-text-field>
                </div>
                <div :slot="panelScope.footer">
                    <f-button size="medium" variant="primary" @click="panelScope.close('save')">
                        Spara
                    </f-button>
                    <f-button size="medium" variant="tertiary" @click="panelScope.close('cancel')">
                        Avbryt
                    </f-button>
                </div>
            </template>
        </details-panel>
    </section>
</template>
