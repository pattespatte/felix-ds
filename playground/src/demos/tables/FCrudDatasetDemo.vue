<script setup lang="ts">
import {
    FCrudDataset,
    FTable,
    FTextField,
    defineTableColumns,
    useDatasetRef,
} from "@fkui/vue";

interface GearRow {
    namn: string;
    kategori: string;
    antal: string;
}

type CrudAction = (item: GearRow) => void;

let updateItemCallback!: CrudAction;
let deleteItemCallback!: CrudAction;

function getColumns(updateItem: CrudAction, deleteItem: CrudAction) {
    updateItemCallback = updateItem;
    deleteItemCallback = deleteItem;
    return columns;
}

const columns = defineTableColumns<GearRow>([
    { type: "text", header: "Utrustning", key: "namn" },
    { type: "text", header: "Kategori", key: "kategori" },
    { type: "text:number", header: "Antal", key: "antal", decimals: 0 },
    {
        type: "menu",
        header: "Åtgärder",
        text(row) {
            return `Visa åtgärder för ${row.namn}`;
        },
        actions: [
            {
                label: "Ändra",
                icon: "pen",
                onClick(row) {
                    updateItemCallback(row);
                },
            },
            {
                label: "Ta bort",
                icon: "trashcan",
                onClick(row) {
                    deleteItemCallback(row);
                },
            },
        ],
    },
]);

const rows = useDatasetRef<GearRow>([
    { namn: "Laptop", kategori: "Datorer", antal: "12" },
    { namn: "Skärm 27 tum", kategori: "Skärmar", antal: "8" },
    { namn: "Konferensmikrofon", kategori: "Ljud", antal: "3" },
    { namn: "Dokumentskanner", kategori: "Kontor", antal: "2" },
]);
</script>

<template>
    <section id="fcruddataset" aria-labelledby="fcruddataset-heading" class="demo">
        <h2 id="fcruddataset-heading">FCrudDataset</h2>
        <p class="demo__description">
            Datamängd med inbyggd redigering och borttagning – åtgärdsmenyn
            i tabellen öppnar formulärmodalen (Ändra) respektive
            bekräftelsedialogen (Ta bort).
        </p>
        <f-crud-dataset
            v-model="rows"
            modify-modal-header="Ändra utrustning"
            delete-modal-header="Ta bort utrustning?"
        >
            <template #default="{ updateItem, deleteItem }">
                <f-table :rows :columns="getColumns(updateItem, deleteItem)">
                    <template #caption> Utrustning i lager </template>
                </f-table>
            </template>
            <template #modify="{ item }">
                <f-text-field v-model="item.namn"> Utrustning </f-text-field>
            </template>
            <template #delete="{ item }">
                <p>Vill du verkligen ta bort ”{{ item.namn }}”?</p>
            </template>
        </f-crud-dataset>
    </section>
</template>
