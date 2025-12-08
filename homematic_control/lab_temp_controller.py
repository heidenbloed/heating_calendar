import homematicip
import homematicip.group
import homematicip.home
import asyncio

LAB_HEATING_GROUP_ID = "24b8872c-0ff7-49d5-86f0-f9f783285fd1"


class LabTempController:
    def __init__(self):
        home_config = homematicip.find_and_load_config_file()
        self._home = homematicip.home.Home()
        asyncio.run(
            self._home.init_async(
                access_point_id=home_config.access_point,
                auth_token=home_config.auth_token,
            )
        )

    def set_temp(self, temp: float):
        asyncio.run(self.set_temp_async(temp))

    async def set_temp_async(self, temp: float):
        await self._home.get_current_state_async()
        lab_heating: homematicip.group.HeatingGroup = self._home.search_group_by_id(
            LAB_HEATING_GROUP_ID
        )
        await lab_heating.set_point_temperature_async(temp)
