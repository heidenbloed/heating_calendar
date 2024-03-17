import datetime
import logging
import time

import lab_temp_controller
import schedule

HEATING_CALENDAR = [
    datetime.datetime.today() + datetime.timedelta(days=day_offset)
    for day_offset in range(0, 10, 2)
]
HEATING_ON_TEMP = 20.0
HEATING_OFF_TEMP = 14.0
HEATING_ON_TIME = "07:00"
HEATING_OFF_TIME = "16:00"


class HeatingSchedular:

    def __init__(self):
        self._lab_controler = lab_temp_controller.LabTempController

    def run_endless(self):
        schedule.every().day.at(HEATING_ON_TIME).do(self._apply_todays_heating_settings)

        logging.info("Enter the endless heating scheduling loop.")
        while True:
            idle_seconds = schedule.idle_seconds()
            logging.info(f"Sleep for {idle_seconds / (60*60)} hours.")
            time.sleep(idle_seconds)
            schedule.run_pending()

    def _apply_todays_heating_settings(self):
        logging.info("Apply todays heating settings.")
        if datetime.datetime.today() in HEATING_CALENDAR:
            logging.info(
                f"Today the heating will be turned on between {HEATING_ON_TIME} and {HEATING_OFF_TIME}."
            )
            self._lab_controler.set_temp(HEATING_ON_TEMP)
            schedule.every().day.at(HEATING_OFF_TIME).do(self._turn_off_heating)
        else:
            logging.info("Today the heating will not be turned on.")

    def _turn_off_heating(self) -> schedule.CancelJob:
        logging.info("Turn off the heating for today.")
        self._lab_controler.set_temp(HEATING_OFF_TEMP)
        return schedule.CancelJob
