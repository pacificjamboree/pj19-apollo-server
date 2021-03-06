#!/bin/bash
PATH=/usr/local/bin:$PATH
DEPLOY_DIR=/var/www/server

# get params from ssm and write to file
# install fx
if [ ! -L /usr/local/bin/fx ] ; then npm -g i fx ; fi
aws ssm get-parameters-by-path --path /graphql/prod/env/ --output json --region ca-central-1 | \
  fx 'this.Parameters.map(x => `${x.Name.replace(/\/graphql\/prod\/env\//, "")}=${x.Value}`).join("\n")' \
  > $DEPLOY_DIR/.env

# yarn install
cd $DEPLOY_DIR && yarn

# run database migrations
cd $DEPLOY_DIR && yarn knex migrate:latest

# chown app directory
chown -R apache:ec2-user $DEPLOY_DIR
chmod -R g+w $DEPLOY_DIR
