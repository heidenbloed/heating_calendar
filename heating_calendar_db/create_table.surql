DEFINE TABLE heating_calendar SCHEMAFULL PERMISSIONS NONE;

DEFINE FIELD day ON heating_calendar TYPE datetime PERMISSIONS FULL;
DEFINE FIELD heating ON heating_calendar TYPE bool PERMISSIONS FULL;

DEFINE EVENT heating_calendar ON heating_calendar WHEN $event = 'CREATE' THEN (DELETE heating_calendar WHERE day < time::now() - 1w);