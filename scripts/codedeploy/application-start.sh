#!/bin/bash
PATH=/usr/local/bin:$PATH

su -c "pm2 start jobs" ec2-user
service httpd start
	
