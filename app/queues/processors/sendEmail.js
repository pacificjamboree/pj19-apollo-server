const { sendPatrolAdventureSelectionMessage } = require('../../lib/mail');

module.exports = () => {
  return async job => {
    const { type, data } = job.data;
    console.log({ type, data });
    switch (type) {
      case 'ADVENTURE_SELECTION':
        return sendPatrolAdventureSelectionMessage(data);
      default:
        break;
    }
  };
};
