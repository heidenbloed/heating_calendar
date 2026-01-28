import { defineStore } from "pinia";
import {
  getHeatingDays as getHeatingDatesApi,
  isAuthenticated as isAuthenticatedApi,
  login as loginApi,
  toggleHeatingDay as toggleHeatingDayApi,
} from "../api/heatingCalendarApi";

export interface CalendarDate {
  day: number;
  month: number;
  year: number;
}

function convHeatingCalendarEntries(
  heatingCalendarEntries: string[],
): CalendarDate[] {
  return heatingCalendarEntries.map((heatingCalendarEntry: string) => {
    const heatingDate = new Date(heatingCalendarEntry);
    return {
      day: heatingDate.getDate(),
      month: heatingDate.getMonth() + 1,
      year: heatingDate.getFullYear(),
    };
  });
}

export const useAuthDb = defineStore("db", () => {
  const isLoggedIn = isAuthenticatedApi;

  async function login(username: string, password: string): Promise<boolean> {
    try {
      await loginApi(username, password);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function getHeatingDates(): Promise<Array<CalendarDate>> {
    if (isLoggedIn.value) {
      return convHeatingCalendarEntries(await getHeatingDatesApi());
    } else {
      return [];
    }
  }

  async function toggleHeatingDay(calendarDate: CalendarDate) {
    if (isLoggedIn.value) {
      const paddedMonth = String(calendarDate.month).padStart(2, "0");
      const paddedDay = String(calendarDate.day).padStart(2, "0");
      const isoDate = `${calendarDate.year}-${paddedMonth}-${paddedDay}`;
      return convHeatingCalendarEntries(await toggleHeatingDayApi(isoDate));
    } else {
      return [];
    }
  }

  return {
    getHeatingDates,
    toggleHeatingDay,
    login,
    isLoggedIn,
  };
});
