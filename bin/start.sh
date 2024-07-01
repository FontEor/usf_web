#! /bin/bash
cp ./susfweb.conf /export/servers/nginx/conf/domains/
mkdir -p /dev/shm/nginx_temp/client_body
sudo /export/servers/nginx/sbin/nginx -c /export/servers/nginx/conf/nginx.conf
