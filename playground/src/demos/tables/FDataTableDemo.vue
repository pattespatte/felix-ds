<script setup lang="ts">
import { FDataTable, FTableColumn, FTableColumnType } from "@fkui/vue";

interface BookingRow {
    id: string;
    lokal: string;
    datum: string;
    platser: number;
    status: string;
}

const rows: BookingRow[] = [
    { id: "1", lokal: "Grupprum 1", datum: "2026-09-21", platser: 6, status: "Bekräftad" },
    { id: "2", lokal: "Grupprum 2", datum: "2026-09-22", platser: 8, status: "Väntar" },
    { id: "3", lokal: "Mötesrum Norr", datum: "2026-09-23", platser: 12, status: "Bekräftad" },
    { id: "4", lokal: "Tyst rum", datum: "2026-09-23", platser: 2, status: "Bekräftad" },
    { id: "5", lokal: "Mötesrum Söder", datum: "2026-09-25", platser: 10, status: "Avbokad" },
];
</script>

<template>
    <section id="fdatatable" aria-labelledby="fdatatable-heading" class="demo">
        <h2 id="fdatatable-heading">FDataTable</h2>
        <p class="demo__description">
            Kolumner deklareras med FTableColumn i mallen – radrubrik,
            datumkolumn med formatbeskrivning och numerisk kolumn.
        </p>
        <f-data-table :rows key-attribute="id">
            <template #caption> Bokade lokaler </template>
            <template #default="{ row }">
                <f-table-column title="Lokal" row-header :type="FTableColumnType.TEXT">
                    {{ row.lokal }}
                </f-table-column>
                <f-table-column
                    title="Datum"
                    :type="FTableColumnType.DATE"
                    description="(åååå-mm-dd)"
                    expand
                >
                    {{ row.datum }}
                </f-table-column>
                <f-table-column title="Platser" :type="FTableColumnType.NUMERIC">
                    {{ row.platser }}
                </f-table-column>
                <f-table-column title="Status" :type="FTableColumnType.TEXT">
                    {{ row.status }}
                </f-table-column>
            </template>
        </f-data-table>
    </section>
</template>
