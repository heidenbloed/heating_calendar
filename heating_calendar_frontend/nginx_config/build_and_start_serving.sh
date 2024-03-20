#!/bin/zsh

stty -echo
printf "Enter the sudo password, please:"
read -s PW
stty echo
printf "\n"

echo "Run vite build."
echo $PW | sudo npm run build -- --outDir /var/www/html

echo "Update Nginx config and restart."
echo $PW | sudo cp heating_calendar.nginx.conf /etc/nginx/sites-available/
if [ ! -f "/etc/nginx/sites-enabled/heating_calendar.nginx.conf" ]; then
echo $PW | sudo ln -s "/etc/nginx/sites-available/heating_calendar.nginx.conf" "/etc/nginx/sites-enabled/"
fi
echo $PW | sudo systemctl restart nginx