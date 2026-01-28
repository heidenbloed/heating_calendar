import os

import requests

HEATING_CALENDAR_API_URL = os.environ["HEATING_CALENDAR_API_URL"]
HEATING_CALENDAR_API_PATH = "is_today_a_heating_day"


def is_today_heating_on() -> bool:
    heating_calendar_api_url = f"{HEATING_CALENDAR_API_URL}/{HEATING_CALENDAR_API_PATH}"
    response = requests.get(heating_calendar_api_url, timeout=10.0)
    return response.json()


if __name__ == "__main__":
    print(is_today_heating_on())
