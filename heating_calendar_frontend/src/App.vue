<template>
  <LoginView />
  <div class="mx-auto w-96">
    <div class="flex flex-col place-items-center gap-4 p-4">
      <h1 class="text-4xl font-bold">Heizkalender</h1>
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
import LoginView from "./components/LoginView.vue";
import { CalendarDate, useAuthDb } from "./stores/authDb";

const db = useAuthDb();

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
  updateHeatingDates();
});

async function updateHeatingDates() {
  const heatingDates = await db.getHeatingDates();
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
    await db.removeHeatingDate(calendarDate);
  } else {
    await db.addHeatingDate(calendarDate);
  }
  await updateHeatingDates();
}
</script>
