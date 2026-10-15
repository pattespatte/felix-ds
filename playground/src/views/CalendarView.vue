<script setup lang="ts">
import FCalendarDemo from "../demos/calendar/FCalendarDemo.vue";
import FDatepickerFieldDemo from "../demos/calendar/FDatepickerFieldDemo.vue";
</script>

<template>
    <div class="view">
        <h1>Datum och kalender</h1>
        <p class="view__intro">
            Använd datumfältet när användaren ska välja datum och kalendern
            när datum ska visas – med svenska månads- och
            dagbeteckningar och temats färger.
        </p>

        <f-calendar-demo />
        <f-datepicker-field-demo />
    </div>
</template>
