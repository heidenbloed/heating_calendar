import asyncio
import os

import surrealdb

DB_URL = "ws://localhost:8000/rpc"
DB_USER = "root"
DB_PASS = os.environ["HEATING_CALENDAR_DB_PASS"]
DB_NAMESPACE = "heating_calendar"
DB_NAME = "heating_calendar"
TODAYS_HEATING_SETTING_QUERY = "SELECT * FROM heating_calendar WHERE date > time::now() - 12h && date < time::now() + 12h;"


def is_today_heating_on() -> bool:
    return asyncio.run(_is_today_heating_on())


async def _is_today_heating_on() -> bool:
    async with surrealdb.Surreal(url=DB_URL) as db:
        await db.signin({"user": DB_USER, "pass": DB_PASS})
        await db.use(DB_NAMESPACE, DB_NAME)
        todays_heating_settings = await db.query(TODAYS_HEATING_SETTING_QUERY)
        return (
            len(todays_heating_settings) > 0
            and len(todays_heating_settings[0]["result"]) > 0
            and todays_heating_settings[0]["result"][0]["heating"]
        )


if __name__ == "__main__":
    print(is_today_heating_on())
