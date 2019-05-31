#!/bin/bash

docker-compose exec -u postgres db psql pj -c "DELETE FROM patrol_schedule"
docker-compose exec -u postgres db psql pj -c "DELETE FROM adventure_period"
docker-compose exec web node scripts/seedPeriods/seedHalfDayAdventurePeriods.js
docker-compose exec web node scripts/seedPeriods/seedFullDayAdventurePeriods.js
docker-compose exec web node scripts/seedPeriods/seedJdfAdventurePeriods.js
docker-compose exec web node scripts/seedPeriods/seedFencingAndStemPeriods.js
docker-compose exec web node scripts/seedPeriods/seedArcheryAndStemPeriods.js
docker-compose exec web node scripts/seedPeriods/seedOceanWisePeriods.js