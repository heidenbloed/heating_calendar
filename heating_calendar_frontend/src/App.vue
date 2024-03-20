<template>
  <div class="mx-auto w-96">
    <div class="flex flex-col place-items-center gap-4 p-4">
      <h1 class="text-4xl font-bold">Heizkalendar</h1>
      <VCalendar
        transparent
        borderless
        expanded
        :rows="2"
        :first-day-of-week="2"
        :disabled-dates="[{ start: null, end: new Date() }]"
        :attributes="calendarAttributes"
        @dayclick="onDayClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarDay } from "v-calendar/dist/types/src/utils/page.js";
import { computed, onMounted, ref } from "vue";
import {
  CalendarDate,
  addHeatingDate,
  connectToDb,
  getHeatingDates,
  removeHeatingDate,
} from "./heatingCalendarApi";

const highlightDates = ref<Array<CalendarDate>>([]);
const calendarAttributes = computed(() => {
  const dates = highlightDates.value.map((calanderDate) => {
    return new Date(
      calanderDate.year,
      calanderDate.month - 1,
      calanderDate.day,
    );
  });
  return [
    {
      highlight: "red",
      dates: dates,
      order: 0,
    },
  ];
});

onMounted(async () => {
  await connectToDb();
  updateHeatingDates();
});

async function updateHeatingDates() {
  const heatingDates = await getHeatingDates();
  highlightDates.value = heatingDates;
}

async function onDayClick(calendarDay: CalendarDay) {
  const calendarDate = {
    day: calendarDay.day,
    month: calendarDay.month,
    year: calendarDay.year,
  };
  const highlightIndex = highlightDates.value.findIndex(
    (elem) =>
      elem.day === calendarDate.day &&
      elem.month === calendarDate.month &&
      elem.year === calendarDate.year,
  );
  if (highlightIndex >= 0) {
    await removeHeatingDate(calendarDate);
  } else {
    await addHeatingDate(calendarDate);
  }
  await updateHeatingDates();
}
</script>
