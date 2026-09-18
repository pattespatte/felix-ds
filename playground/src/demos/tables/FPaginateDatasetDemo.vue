<script setup lang="ts">
import { FList, FPaginateDataset, FPaginator } from "@fkui/vue";

interface MaintenanceItem {
    id: string;
    atgard: string;
    intervall: string;
}

const items: MaintenanceItem[] = [
    { id: "1", atgard: "Byt filter i ventilationen", intervall: "Var 6:e månad" },
    { id: "2", atgard: "Kontrollera brandposter", intervall: "Årligen" },
    { id: "3", atgard: "Kalibrera vågar", intervall: "Var 12:e månad" },
    { id: "4", atgard: "Rengör fasadfönster", intervall: "Var 6:e månad" },
    { id: "5", atgard: "Serva hissar", intervall: "Var 6:e månad" },
    { id: "6", atgard: "Kontrollera nödbelysning", intervall: "Årligen" },
    { id: "7", atgard: "Byt batterier i rökdetektorer", intervall: "Var 12:e månad" },
    { id: "8", atgard: "Inspektera tak och hängrännor", intervall: "Var 2:e år" },
    { id: "9", atgard: "Rensa golvbrunnar", intervall: "Var 6:e månad" },
    { id: "10", atgard: "Underhåll utemöbler", intervall: "Var 4:e år" },
    { id: "11", atgard: "Justera dörrstängare", intervall: "Var 12:e månad" },
    { id: "12", atgard: "Kontrollera vattenkvalitet", intervall: "Var 3:e månad" },
    { id: "13", atgard: "Byt lampor i gemensamma utrymmen", intervall: "Vid behov" },
    { id: "14", atgard: "Serva brandsläckare", intervall: "Var 12:e månad" },
    { id: "15", atgard: "Kontrollera inbrottslarm", intervall: "Var 6:e månad" },
    { id: "16", atgard: "Rengör fasad", intervall: "Var 5:e år" },
    { id: "17", atgard: "Besiktiga elcentraler", intervall: "Var 3:e år" },
    { id: "18", atgard: "Kontrollera ventiler och spjäll", intervall: "Årligen" },
    { id: "19", atgard: "Underhåll mark och beläggning", intervall: "Var 2:e år" },
    { id: "20", atgard: "Översyn av skyltning", intervall: "Var 5:e år" },
];
</script>

<template>
    <section id="fpaginatedataset" aria-labelledby="fpaginatedataset-heading" class="demo">
        <h2 id="fpaginatedataset-heading">FPaginateDataset</h2>
        <p class="demo__description">
            Sidindelad datamängd – 20 underhållsåtgärder visas fem i taget
            tillsammans med pagineringen (FPaginator).
        </p>
        <f-paginate-dataset :items :items-per-page="5">
            <template #default="{ items: currentPageItems }">
                <f-list id="underhall" :items="currentPageItems">
                    <template #default="{ item }">
                        <p>{{ item.atgard }} – {{ item.intervall }}</p>
                    </template>
                    <template #screenreader="{ item }"> {{ item.atgard }} </template>
                </f-list>
                <f-paginator />
            </template>
        </f-paginate-dataset>
    </section>
</template>
