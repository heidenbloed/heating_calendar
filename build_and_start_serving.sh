#!/bin/zsh
echo "Init database."
cd heating_calendar_db
./install_service.sh
cd ..

echo "Run vite build."
cd heating_calendar_frontend
npm install
npx vite build --outDir dist
sudo rm -r /var/www/heating_calendar_frontend
sudo cp -r dist /var/www/heating_calendar_frontend
cd ..

echo "Update Nginx config and restart."
sudo cp heating_calendar.nginx.conf /etc/nginx/sites-available/
if [ ! -f "/etc/nginx/sites-enabled/heating_calendar.nginx.conf" ]; then
sudo ln -s "/etc/nginx/sites-available/heating_calendar.nginx.conf" "/etc/nginx/sites-enabled/"
fi
sudo systemctl restart nginx
