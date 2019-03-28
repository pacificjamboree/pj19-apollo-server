const { User } = require('../../models');

const getViewer = id =>
  User.query()
    .where({ id })
    .eager(
      '[offerOfService.assignment.[offersOfService, managers], patrolScouter.[patrols.[adventureSelection]]]'
    )
    .first();

module.exports = { getViewer };
