import os

import requests

DB_URL_BASE = os.environ["HEATING_CALENDAR_DB_URL"]
DB_USER = os.environ["HEATING_CALENDAR_DB_USER"]
DB_PASS = os.environ["HEATING_CALENDAR_DB_PASS"]
DB_URL_SIGNIN = f"{DB_URL_BASE}/signin"
DB_URL_QUERY = f"{DB_URL_BASE}/sql"
DB_NAMESPACE = "heating_calendar"
DB_NAME = "heating_calendar"
TODAYS_HEATING_SETTING_QUERY = (
    "SELECT * FROM heating_calendar WHERE date > time::now() - 12h && date <"
    " time::now() + 12h;"
)


def _sign_in_db() -> str:
    sign_in_response = requests.post(
        url=DB_URL_SIGNIN,
        json={"user": DB_USER, "pass": DB_PASS},
        headers={"Accept": "application/json"},
    )
    sign_in_response.raise_for_status()
    token = sign_in_response.json()["token"]
    return token


def _query_db_for_todays_heating_setting(token: str) -> list:
    query_response = requests.post(
        url=DB_URL_QUERY,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
            "surreal-ns": DB_NAMESPACE,
            "surreal-db": DB_NAME,
        },
        data=TODAYS_HEATING_SETTING_QUERY,
    )
    query_response.raise_for_status()
    return query_response.json()


def is_today_heating_on() -> bool:
    db_token = _sign_in_db()
    todays_heating_settings = _query_db_for_todays_heating_setting(token=db_token)
    return (
        len(todays_heating_settings) > 0
        and len(todays_heating_settings[0]["result"]) > 0
    )


if __name__ == "__main__":
    print(is_today_heating_on())
