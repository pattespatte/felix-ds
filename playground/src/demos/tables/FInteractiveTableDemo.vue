<script setup lang="ts">
import { computed, ref } from "vue";
import {
    FInteractiveTable,
    FSortFilterDataset,
    FTableButton,
    FTableColumn,
    FTableColumnType,
} from "@fkui/vue";

interface ErrandRow {
    id: string;
    rubrik: string;
    datum: string;
    status: string;
}

const rows = ref<ErrandRow[]>([
    { id: "1", rubrik: "Byte av lampor", datum: "2026-09-21", status: "Pågår" },
    { id: "2", rubrik: "Service ventilation", datum: "2026-09-22", status: "Planerad" },
    { id: "3", rubrik: "Reparation dörr", datum: "2026-09-23", status: "Väntar" },
    { id: "4", rubrik: "Besiktning tak", datum: "2026-09-25", status: "Klar" },
]);

const valda = ref<ErrandRow[]>([]);
const senasteAtgard = ref("");

function redigera(rad: ErrandRow): void {
    senasteAtgard.value = `Redigerar "${rad.rubrik}".`;
}

function taBort(rad: ErrandRow): void {
    rows.value = rows.value.filter((r) => r.id !== rad.id);
    valda.value = valda.value.filter((r) => r.id !== rad.id);
    senasteAtgard.value = `Tog bort "${rad.rubrik}".`;
}

const sortableAttributes = { rubrik: "Ärende" };

const statusText = computed(() => {
    const markerade = `${valda.value.length} rader markerade`;
    return senasteAtgard.value ? `${markerade} – ${senasteAtgard.value}` : markerade;
});
</script>

<template>
    <section id="finteractivetable" aria-labelledby="finteractivetable-heading" class="demo">
        <h2 id="finteractivetable-heading">FInteractiveTable</h2>
        <p class="demo__description">
            Interaktiv tabell med flerval av rader, sortering på kolumnen
            Ärende samt åtgärdsknappar (FTableButton) i en smal
            åtgärdskolumn.
        </p>
        <f-sort-filter-dataset :data="rows" :sortable-attributes>
            <template #default="{ sortFilterResult }">
                <f-interactive-table
                    v-model="valda"
                    :rows="sortFilterResult"
                    selectable="multi"
                    key-attribute="id"
                >
                    <template #caption> Pågående ärenden </template>
                    <!-- Labels the row checkboxes (FKUI renders the field's
                         label empty without this slot). -->
                    <template #checkbox-description="{ row }">
                        Markera {{ row.rubrik }}
                    </template>
                    <template #default="{ row }">
                        <f-table-column
                            name="rubrik"
                            title="Ärende"
                            row-header
                            :type="FTableColumnType.TEXT"
                        >
                            {{ row.rubrik }}
                        </f-table-column>
                        <f-table-column title="Datum" :type="FTableColumnType.DATE">
                            {{ row.datum }}
                        </f-table-column>
                        <f-table-column title="Status" :type="FTableColumnType.TEXT">
                            {{ row.status }}
                        </f-table-column>
                        <f-table-column title="Åtgärd" :type="FTableColumnType.ACTION" shrink>
                            <f-table-button icon="pen" @click="redigera(row)">
                                Redigera
                            </f-table-button>
                            <f-table-button icon="trashcan" @click="taBort(row)">
                                Ta bort
                            </f-table-button>
                        </f-table-column>
                    </template>
                </f-interactive-table>
            </template>
        </f-sort-filter-dataset>
        <p aria-live="polite">{{ statusText }}</p>
    </section>
</template>
