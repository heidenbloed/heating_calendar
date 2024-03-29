#!/bin/zsh
echo "Init database."
cd heating_calendar_db
./install_service.sh
cd ..

echo "Run vite build."
cd heating_calendar_frontend
npm run build -- --outDir /var/www/heating_calendar_frontend
cd ..

echo "Update Nginx config and restart."
cp heating_calendar.nginx.conf /etc/nginx/sites-available/
if [ ! -f "/etc/nginx/sites-enabled/heating_calendar.nginx.conf" ]; then
ln -s "/etc/nginx/sites-available/heating_calendar.nginx.conf" "/etc/nginx/sites-enabled/"
fi
systemctl restart nginx