const { ADVENTURE_GUIDE_PDF } = require('../index');
const adventureGuidePdf = require('./adventureGuidePdf');

module.exports = {
  processorInitialisers: {
    [ADVENTURE_GUIDE_PDF]: adventureGuidePdf,
  },
};
