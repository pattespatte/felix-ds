<script setup lang="ts">
import { ref } from "vue";
import { FCrudButton, FCrudDataset, FTextField } from "@fkui/vue";

interface Activity {
    id: string;
    name: string;
}

const activities = ref<Activity[]>([
    { id: "1", name: "Förbereda veckomöte" },
    { id: "2", name: "Skicka rapport" },
    { id: "3", name: "Boka resa" },
]);
</script>

<template>
    <section id="fcrudbutton" aria-labelledby="fcrudbutton-heading" class="demo">
        <h2 id="fcrudbutton-heading">FCrudButton</h2>
        <p class="demo__description">
            Åtgärdsknapparna ändra och ta bort är avsedda inuti en datamängd
            (FCrudDataset). De öppnar mängdens formulär- respektive
            bekräftelsedialog – prova genom att klicka.
        </p>
        <f-crud-dataset
            v-model="activities"
            modify-modal-header="Ändra aktivitet"
            delete-modal-header="Ta bort aktivitet?"
        >
            <template #default>
                <ul class="crud-demo-list">
                    <li v-for="activity in activities" :key="activity.id">
                        <span>{{ activity.name }}</span>
                        <span class="crud-demo-list__actions">
                            <f-crud-button :item="activity" action="modify" icon label>
                                Ändra
                            </f-crud-button>
                            <f-crud-button :item="activity" action="delete" icon label>
                                Ta bort
                            </f-crud-button>
                        </span>
                    </li>
                </ul>
            </template>
            <template #modify="{ item }">
                <f-text-field v-model="item.name"> Aktivitet </f-text-field>
            </template>
            <template #delete="{ item }">
                <p>Är du säker på att du vill ta bort ”{{ item.name }}”?</p>
            </template>
        </f-crud-dataset>
    </section>
</template>

<style scoped lang="scss">
.crud-demo-list {
    margin: 0;
    padding: 0;
    list-style: none;
    max-width: 32rem;
}

.crud-demo-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--fkds-color-border-weak, #d7d9e0);
}

.crud-demo-list__actions {
    display: inline-flex;
    gap: 0.5rem;
}
</style>
