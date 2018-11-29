#!/bin/bash
PATH=/usr/local/bin:$PATH
DEPLOY_DIR=/var/www/server

# get params from ssm and write to file
# install fx
if [ ! -L /usr/local/bin/fx ] ; then npm -g i fx ; fi
aws ssm get-parameters-by-path --path /graphql/prod/env/ --output json --region ca-central-1 | \
  fx 'this.Parameters.map(x => `${x.Name.replace(/\/graphql\/prod\/env\//, "")}=${x.Value}`).join("\n")' \
  > $DEPLOY_DIR/.env

# chown app directory
chown -R apache:ec2-user $DEPLOY_DIR

# yarn install
su - apache -c "cd $DEPLOY_DIR && yarn"

# run database migrations
su - apache -c "cd $DEPLOY_DIR && yarn knex migrate:latest"

# restart apache
service httpd start