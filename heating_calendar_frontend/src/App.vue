<template>
  <div class="flex flex-col place-items-center gap-4 p-4">
    <h1 class="font-bold text-4xl">Heating calendar</h1>
    <VCalendar transparent borderless :disabled-dates="[{'start': null, 'end': new Date()}]"/>
  </div>
</template>
