<script setup lang="ts">
import { shallowRef } from "vue";
import { FDate } from "@fkui/date";
import { FCalendar } from "@fkui/vue";

const today = FDate.fromIso(new Date().toISOString().slice(0, 10));

// Två neutrala exempelhändelser i aktuell månad, dag 3 och dag 17.
const events = new Map<number, string>([
    [3, "Planering"],
    [17, "Avlämning"],
]);

const month = shallowRef<FDate>(today);
const min = shallowRef<FDate>(FDate.fromIso(`${today.year - 1}-01-01`));
const max = shallowRef<FDate>(FDate.fromIso(`${today.year + 1}-12-31`));
const selectedDay = shallowRef<FDate | undefined>(undefined);

function onSelectDay(date: FDate): void {
    selectedDay.value = date;
}

function dayClasses(date: FDate): string[] {
    const classes = ["calendar-demo__day"];
    if (selectedDay.value && date.equals(selectedDay.value)) {
        classes.push("calendar-demo__day--selected");
    }
    return classes;
}
</script>

<template>
    <section id="fcalendar" aria-labelledby="fcalendar-heading" class="demo">
        <h2 id="fcalendar-heading">FCalendar och FCalendarDay</h2>
        <p class="demo__description">
            Kalender med egna dagceller (FCalendarDay anpassas via dagslotten):
            vald dag markeras och två exempelhändelser visas. Klicka på en dag
            för att välja den – färgerna kommer från temats tokens.
        </p>
        <f-calendar
            v-model="month"
            :min-date="min"
            :max-date="max"
            :tab-date="today"
            @click="onSelectDay"
        >
            <template #default="{ date }">
                <span :class="dayClasses(date)">
                    <span class="calendar-demo__date">{{ date.day }}</span>
                    <span v-if="events.get(date.day)" class="calendar-demo__event">
                        {{ events.get(date.day) }}
                    </span>
                </span>
            </template>
        </f-calendar>
    </section>
</template>

<style scoped lang="scss">
.calendar-demo__day {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    width: 100%;
    height: 100%;
    min-height: 3.25rem;
    padding: 0.25rem;
    box-sizing: border-box;
    text-align: left;
}

.calendar-demo__day--selected {
    outline: 2px solid var(--fkds-color-navigation-border-selected, #232948);
    outline-offset: -2px;
    border-radius: var(--f-border-radius-small, 6px);
}

.calendar-demo__event {
    font-size: var(--f-font-size-small, 0.875rem);
    color: var(--fkds-color-text-secondary, #585f71);
}
</style>
