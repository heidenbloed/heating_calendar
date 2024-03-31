import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { Surreal } from "surrealdb.js";
import { computed, onMounted } from "vue";

export interface CalendarDate {
  day: number;
  month: number;
  year: number;
}

export const useAuthDb = defineStore("db", () => {
  const db = new Surreal();

  const authToken = useLocalStorage<string | null>("authToken", null);
  const isLoggedIn = computed(() => authToken.value !== null);

  async function login(username: string, password: string): Promise<boolean> {
    try {
      const token = await db.signin({
        namespace: "heating_calendar",
        username: username,
        password: password,
      });
      authToken.value = token;
      return true;
    } catch (error) {
      return false;
    }
  }

  async function auth(): Promise<boolean> {
    if (authToken.value === null) {
      return false;
    }
    return await db.authenticate(authToken.value);
  }

  onMounted(async () => {
    await db.connect(`https://heizkalender.heidenblut.eu/db/`, {
      namespace: "heating_calendar",
      database: "heating_calendar",
    });
    await auth();
  });

  async function getHeatingDates(): Promise<Array<CalendarDate>> {
    if (isLoggedIn.value) {
      const heatingCalendarEntries = (
        await db.query("SELECT * FROM heating_calendar")
      )[0] as any[];
      return heatingCalendarEntries.map((heatingCalendarEntry: any) => {
        const heatingDate = new Date(heatingCalendarEntry["date"]);
        return {
          day: heatingDate.getDate(),
          month: heatingDate.getMonth() + 1,
          year: heatingDate.getFullYear(),
        };
      });
    } else {
      return [];
    }
  }

  async function addHeatingDate(calendarDate: CalendarDate) {
    if (isLoggedIn.value) {
      const paddedMonth = String(calendarDate.month).padStart(2, "0");
      const paddedDay = String(calendarDate.day).padStart(2, "0");
      const isoDate = `${calendarDate.year}-${paddedMonth}-${paddedDay}T06:00:00Z`;
      await db.query(`CREATE heating_calendar CONTENT {"date": "${isoDate}"}`);
    }
  }

  async function removeHeatingDate(calendarDate: CalendarDate) {
    if (isLoggedIn.value) {
      const paddedMonth = String(calendarDate.month).padStart(2, "0");
      const paddedDay = String(calendarDate.day).padStart(2, "0");
      const isoDate = `${calendarDate.year}-${paddedMonth}-${paddedDay}T06:00:00Z`;
      await db.query(
        `DELETE heating_calendar WHERE date > "${isoDate}" - 12h && date < "${isoDate}" + 12h`,
      );
    }
  }

  return {
    getHeatingDates,
    addHeatingDate,
    removeHeatingDate,
    login,
    isLoggedIn,
  };
});
