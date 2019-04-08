const { ADVENTURE_GUIDE_PDF, SEND_EMAIL } = require('../index');
const adventureGuidePdf = require('./adventureGuidePdf');
const sendEmail = require('./sendEmail');

module.exports = {
  processorInitialisers: {
    [ADVENTURE_GUIDE_PDF]: adventureGuidePdf,
    [SEND_EMAIL]: sendEmail,
  },
};
