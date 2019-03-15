#!/bin/bash
PATH=/usr/local/bin:$PATH

su -c "pm2 stop jobs" ec2-user
service httpd stop

