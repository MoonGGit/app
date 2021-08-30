#!/bin/sh

certbot --nginx --email answlgus1122@gmail.com --agree-tos --no-eff-email -n \
  -d dayfly.kr  \
  -d myapp.dayfly.kr
echo -e '0\t4\t15\t*\t*\t/usr/bin/certbot renew --renew-hook "/usr/sbin/nginx -s reload"' >> /etc/crontabs/root