<template>
  <div class="mx-auto w-96">
    <div class="flex flex-col place-items-center gap-4 p-4">
      <h1 class="text-4xl font-bold">Heating calendar</h1>
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
import { computed, ref } from "vue";

interface CalendarDate {
  day: number;
  month: number;
  year: number;
}

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

function onDayClick(calandarDay: CalendarDay) {
  const calendarDate = {
    day: calandarDay.day,
    month: calandarDay.month,
    year: calandarDay.year,
  };
  const highlightIndex = highlightDates.value.findIndex(
    (elem) =>
      elem.day === calendarDate.day &&
      elem.month === calendarDate.month &&
      elem.year === calendarDate.year,
  );
  if (highlightIndex >= 0) {
    highlightDates.value.splice(highlightIndex, 1);
  } else {
    highlightDates.value.push(calandarDay);
  }
}
</script>
