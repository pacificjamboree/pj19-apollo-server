const { User } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const getUser = input =>
  User.query()
    .where(whereSearchField(input))
    .eager('[offerOfService, patrolScouter]')
    .first();

module.exports = {
  getUser,
};
