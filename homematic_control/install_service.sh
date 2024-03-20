echo "Stop service"
systemctl stop homematic_control.service
echo "Create venv and install python requirements"
python3 -m pip install virtualenv
python3 -m virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
echo "Copy service"
cp homematic_control.service /etc/systemd/system/
echo "Enable service"
systemctl enable homematic_control.service
echo "Start service"
systemctl start homematic_control.service
echo "Status of service"
systemctl status homematic_control.service