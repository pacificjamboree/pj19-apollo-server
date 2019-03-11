#!/bin/bash

su -c "pm2 start jobs" ec2-user
service httpd start
	
