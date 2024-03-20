echo "Stop service"
systemctl stop heating_calendar_db.service
echo "Copy service"
cp heating_calendar_db.service /etc/systemd/system/
echo "Enable service"
systemctl enable heating_calendar_db.service
echo "Start service"
systemctl start heating_calendar_db.service
echo "Status of service"
systemctl status heating_calendar_db.service
echo "Set up table"
. ./init_db.sh