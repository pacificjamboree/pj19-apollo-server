const { Adventure } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const getAdventure = input =>
  Adventure.query()
    .where(whereSearchField(input))
    .eager('[offersOfService, managers]')
    .first();

module.exports = { getAdventure };
