DEFINE TABLE heating_calendar SCHEMAFULL PERMISSIONS NONE;

DEFINE FIELD date ON heating_calendar TYPE datetime PERMISSIONS FULL;

DEFINE EVENT heating_calendar ON heating_calendar WHEN $event = 'CREATE' THEN (DELETE heating_calendar WHERE date < time::now() - 1w);