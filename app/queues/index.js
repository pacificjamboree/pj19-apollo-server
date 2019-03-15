const Queue = require('bull');

const { JOBS_REDIS_HOST, JOBS_REDIS_PORT } = process.env;

const ADVENTURE_GUIDE_PDF = 'ADVENTURE_GUIDE_PDF';

module.exports = {
  ADVENTURE_GUIDE_PDF,
  queues: {
    [ADVENTURE_GUIDE_PDF]: new Queue(
      ADVENTURE_GUIDE_PDF,
      `redis://${JOBS_REDIS_HOST}:${JOBS_REDIS_PORT}}`
    ),
  },
};
