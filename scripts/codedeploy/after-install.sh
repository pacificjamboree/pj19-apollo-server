#!/bin/bash

# get params from ssm and write to file
# install fx
if [ ! -L /usr/local/bin/fx ] ; then npm -g i fx ; fi
aws ssm get-parameters-by-path --path /graphql/prod/env/ --output json | \
  fx 'this.Parameters.map(x => `${x.Name.replace(/\/graphql\/prod\/env\//, "")}=${x.Value}`).join("\n")' \
  > /home/ec2-user/server/.env

# chown app directory
chown -R ec2-user:ec2-user /home/ec2-user/server