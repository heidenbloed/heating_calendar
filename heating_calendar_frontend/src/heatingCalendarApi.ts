import { Surreal } from "surrealdb.js";

const db = new Surreal();

export async function connectToDb() {
  await db.connect("http://localhost:8000/rpc", {
    // Set the namespace and database for the connection
    namespace: "heating_calendar",
    database: "heating_calendar",

    // Set the authentication details for the connection
    auth: {
      namespace: "heating_calendar",
      database: "heating_calendar",
      username: "root",
      password: import.meta.env.VITE_HEATING_CALENDAR_DB_PASS,
    },
  });
}

export interface CalendarDate {
  day: number;
  month: number;
  year: number;
}

export async function getHeatingDates(): Promise<Array<CalendarDate>> {
  const heatingCalendarEntries = (
    await db.query("SELECT * FROM heating_calendar WHERE heating = true")
  )[0] as any[];
  return heatingCalendarEntries.map((heatingCalendarEntry: any) => {
    const heatingDate = new Date(heatingCalendarEntry["date"]);
    return {
      day: heatingDate.getDate(),
      month: heatingDate.getMonth() + 1,
      year: heatingDate.getFullYear(),
    };
  });
}

export async function addHeatingDate(calendarDate: CalendarDate) {
  const paddedMonth = String(calendarDate.month).padStart(2, "0");
  const paddedDay = String(calendarDate.day).padStart(2, "0");
  const isoDate = `${calendarDate.year}-${paddedMonth}-${paddedDay}T06:00:00Z`;
  await db.query(
    `CREATE heating_calendar CONTENT {"date": "${isoDate}", "heating": true}`,
  );
}

export async function removeHeatingDate(calendarDate: CalendarDate) {
  const paddedMonth = String(calendarDate.month).padStart(2, "0");
  const paddedDay = String(calendarDate.day).padStart(2, "0");
  const isoDate = `${calendarDate.year}-${paddedMonth}-${paddedDay}T06:00:00Z`;
  await db.query(
    `DELETE heating_calendar WHERE date > "${isoDate}" - 12h && date < "${isoDate}" + 12h`,
  );
}
