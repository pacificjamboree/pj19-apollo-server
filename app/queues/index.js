const Queue = require('bull');

const { JOBS_REDIS_HOST, JOBS_REDIS_PORT } = process.env;

const ADVENTURE_GUIDE_PDF = 'ADVENTURE_GUIDE_PDF';
const SEND_EMAIL = 'SEND_EMAIL';
const PATROL_SCHEDULE_PDF = 'PATROL_SCHEDULE_PDF';

const REDIS_URL = `redis://${JOBS_REDIS_HOST}:${JOBS_REDIS_PORT}}`;

module.exports = {
  ADVENTURE_GUIDE_PDF,
  SEND_EMAIL,
  PATROL_SCHEDULE_PDF,
  queues: {
    [ADVENTURE_GUIDE_PDF]: new Queue(ADVENTURE_GUIDE_PDF, REDIS_URL),
    [PATROL_SCHEDULE_PDF]: new Queue(PATROL_SCHEDULE_PDF, REDIS_URL),
    [SEND_EMAIL]: new Queue(SEND_EMAIL, REDIS_URL, {
      limiter: {
        max: 5,
        duration: 1000,
        bounceBack: false,
      },
    }),
  },
};
