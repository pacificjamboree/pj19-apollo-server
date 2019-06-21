const {
  ADVENTURE_GUIDE_PDF,
  PATROL_SCHEDULE_PDF,
  SEND_EMAIL,
} = require('../index');
const adventureGuidePdf = require('./adventureGuidePdf');
const sendEmail = require('./sendEmail');
const patrolSchedulePdf = require('./patrolSchedulePdf');

module.exports = {
  processorInitialisers: {
    [PATROL_SCHEDULE_PDF]: patrolSchedulePdf,
    [ADVENTURE_GUIDE_PDF]: adventureGuidePdf,
    [SEND_EMAIL]: sendEmail,
  },
};
