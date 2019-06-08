const { AdventurePeriod } = require('../../models');

const getAdventurePeriodById = id =>
  AdventurePeriod.query()
    .where({ id })
    .eager('patrols')
    .first();

module.exports = { getAdventurePeriodById };
