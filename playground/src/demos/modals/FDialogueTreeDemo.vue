<script setup lang="ts">
import { ref } from "vue";
import {
    FDialogueTree,
    type FDialogueTreeQuestion,
    type FDialogueTreeUserProgress,
} from "@fkui/vue";

const tree: FDialogueTreeQuestion = {
    label: "Vad vill du göra?",
    options: [
        {
            label: "Ansöka om stöd",
            question: {
                label: "Det finns två vägar att ansöka. Vilken passar dig?",
                options: [
                    {
                        label: "Ansöka digitalt",
                        question: {
                            label: "Logga in och fyll i formuläret digitalt.",
                            userData: { svar: "digitalt" },
                        },
                    },
                    {
                        label: "Ansöka på papper",
                        question: {
                            label: "Ladda ner blanketten, skriv ut och skicka in.",
                            userData: { svar: "papper" },
                        },
                    },
                ],
            },
        },
        {
            label: "Ändra en anmälan",
            question: {
                label: "Vill du ändra själv eller kontakta oss?",
                options: [
                    {
                        label: "Ändra själv",
                        question: {
                            label: "Logga in och öppna din anmälan.",
                            userData: { svar: "själv" },
                        },
                    },
                    {
                        label: "Kontakta oss",
                        question: {
                            label: "Ring oss vardagar 08–17.",
                            userData: { svar: "kontakt" },
                        },
                    },
                ],
            },
        },
    ],
};

const current = ref<FDialogueTreeUserProgress>({
    label: tree.label,
    lastStep: false,
    steps: [],
});
</script>

<template>
    <section id="fdialoguetree" aria-labelledby="fdialoguetree-heading" class="demo">
        <h2 id="fdialoguetree-heading">FDialogueTree</h2>
        <p class="demo__description">
            Frågeträd som lotsar användaren genom val. Komponenten renderar
            valen – aktuell fråga och svaret i sista steget ritar konsumanten
            via v-modellen och slotten.
        </p>
        <h3 class="dialogue-tree-demo__question">{{ current.label }}</h3>
        <f-dialogue-tree v-model="current" :dialogue-tree="tree">
            <template #default="{ userData }">
                <p class="dialogue-tree-demo__answer">
                    Svaret: {{ userData.svar }}
                </p>
            </template>
        </f-dialogue-tree>
    </section>
</template>

<style scoped lang="scss">
.dialogue-tree-demo__question {
    margin-bottom: 0.75rem;
}

.dialogue-tree-demo__answer {
    margin: 0.75rem 0 0;
    padding: 1rem;
    background-color: var(--fkds-color-feedback-background-info, #e7f2ff);
    border-radius: var(--f-border-radius-medium, 8px);
}
</style>
