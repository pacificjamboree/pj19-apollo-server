const {
  sendPatrolWelcomeMessage,
  sendPatrolAdventureSelectionMessage,
} = require('../../lib/mail');

module.exports = () => {
  return async job => {
    const { type, data } = job.data;
    switch (type) {
      case 'PATROL_WELCOME':
        return sendPatrolWelcomeMessage(data);
      case 'ADVENTURE_SELECTION':
        return sendPatrolAdventureSelectionMessage(data);
      default:
        break;
    }
  };
};
