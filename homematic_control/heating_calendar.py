import os
import sqlite3

DB_PATH = os.environ["HEATING_CALENDAR_DB_PATH"]
TODAYS_HEATING_SETTING_QUERY = (
    "SELECT * FROM heating_calendar WHERE date BETWEEN date('now', 'start of day')"
    " AND date('now', 'start of day', '+1 day' ,'-1 second');"
)


def _query_db_for_todays_heating_setting(cursor: sqlite3.Cursor) -> list:
    return cursor.execute(TODAYS_HEATING_SETTING_QUERY).fetchall()


def is_today_heating_on() -> bool:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    todays_heating_settings = _query_db_for_todays_heating_setting(cursor=cursor)
    conn.close()
    return len(todays_heating_settings) > 0


if __name__ == "__main__":
    print(is_today_heating_on())
