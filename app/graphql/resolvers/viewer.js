const { User } = require('../../models');

const getViewer = id =>
  User.query()
    .where({ id })
    .eager(
      '[offerOfService.assignment.[offersOfService, managers], patrolScouter]'
    )
    .first();

module.exports = { getViewer };
