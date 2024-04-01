echo "Stop service"
sudo systemctl stop homematic_control.service
echo "Create venv and install python requirements"
python3 -m pip install virtualenv
python3 -m virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
echo "Copy service"
sudo cp homematic_control.service /etc/systemd/system/
echo "Enable service"
sudo systemctl enable homematic_control.service
echo "Start service"
sudo systemctl start homematic_control.service
echo "Status of service"
sudo systemctl status homematic_control.service