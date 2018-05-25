const { User } = require('../../models');

const getViewer = id =>
  User.query()
    .where({ id })
    .eager(
      '[offerOfService, offerOfService.assignment, offerOfService.assignment.managers, offerOfService.assignment.offersOfService, patrolScouter]'
    )
    .first();

module.exports = { getViewer };
