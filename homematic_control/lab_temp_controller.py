import homematicip
import homematicip.home
import homematicip.group

LAB_HEATING_GROUP_ID = "f97c443b-75f9-430a-9458-d24be5c3ec05"


class LabTempController:

    def __init__(self):
        home_config = homematicip.find_and_load_config_file()
        self._home = homematicip.home.Home()
        self._home.set_auth_token(home_config.auth_token)
        self._home.init(home_config.access_point)

    def set_temp(self, temp: float):
        self._home.get_current_state()
        lab_heating: homematicip.group.HeatingGroup = self._home.search_group_by_id(
            LAB_HEATING_GROUP_ID
        )
        lab_heating.set_point_temperature(temp)
