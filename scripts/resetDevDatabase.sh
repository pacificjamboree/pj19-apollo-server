#!/bin/bash

# resets the dev database and replaces with the last prod backup

BUCKET=s3://dbdumps.adventure.pacificjamboree.ca
DB_DUMP_FILE=$(aws s3 ls $BUCKET | sort| tail -n 1 | awk '{print $4}')

cd ~/code/pacificjamboree/server
aws s3 cp $BUCKET/$DB_DUMP_FILE /tmp
docker-compose stop web jobs
docker-compose up -d db
docker cp /tmp/$DB_DUMP_FILE server_db_1:/tmp
docker-compose exec -u postgres db dropdb --if-exists pj
docker-compose exec -u postgres db createdb pj -O pj
docker-compose exec -u postgres db sh -c "psql pj < /tmp/$DB_DUMP_FILE"

