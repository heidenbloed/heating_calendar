echo "Stop service"
sudo systemctl stop homematic_control.service
echo "Copy service"
sudo cp homematic_control.service /etc/systemd/system/
echo "Enable service"
sudo systemctl enable homematic_control.service
echo "Start service"
sudo systemctl start homematic_control.service
echo "Status of service"
sudo systemctl status homematic_control.service