echo "Stop service"
sudo systemctl stop heating_calendar_db.service
echo "Copy service"
sudo cp heating_calendar_db.service /etc/systemd/system/
echo "Enable service"
sudo systemctl enable heating_calendar_db.service
echo "Start service"
sudo systemctl start heating_calendar_db.service
echo "Status of service"
sudo systemctl status heating_calendar_db.service
echo "Set up table"
. ./init_db.sh
