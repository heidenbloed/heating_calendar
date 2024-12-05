import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { Surreal } from "surrealdb";
import { computed, onMounted, ref } from "vue";

export interface CalendarDate {
  day: number;
  month: number;
  year: number;
}

export const useAuthDb = defineStore("db", () => {
  const db = new Surreal();

  const dbUsername = useLocalStorage<string | null>("dbUsername", null);
  const dbPassword = useLocalStorage<string | null>("dbPassword", null);
  const credentialsAvailable = computed(
    () => dbUsername.value !== null && dbPassword.value !== null,
  );
  const isLoggedIn = ref(false);

  async function login(username: string, password: string): Promise<boolean> {
    try {
      await db.signin({
        username: username,
        password: password,
      });
      dbUsername.value = username;
      dbPassword.value = password;
      isLoggedIn.value = true;
      return true;
    } catch (error) {
      dbUsername.value = null;
      dbPassword.value = null;
      isLoggedIn.value = false;
      return false;
    }
  }

  onMounted(async () => {
    await db.connect("wss://heating-calenda-069ph70s3dv4jc40iunj9q4vv0.aws-euw1.surreal.cloud", {
      namespace: "heating_calendar",
      database: "heating_calendar"
    });
    if (!isLoggedIn.value && credentialsAvailable.value) {
      await login(dbUsername.value as string, dbPassword.value as string);
    }
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
