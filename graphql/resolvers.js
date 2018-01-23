const {
  getAllOffersOfService,
  getOfferOfService,
  getAssignmentForOOS,
  getAllAdventures,
  getAdventure
} = require('./knex_connector');

const { GraphQLDate, GraphQLDateTime } = require('graphql-iso-date');

const resolvers = {
  GraphQLDate,
  GraphQLDateTime,
  Query: {
    // offers of service
    allOffersOfService: () => getAllOffersOfService(),
    offerOfService: (_, { oos_number }) => getOfferOfService(oos_number),

    // adventures
    allAdventures: () => getAllAdventures(),
    adventure: (_, { adventure_code }) => getAdventure(adventure_code)
    assignment: oos => getAssignmentForOOS(oos),
  }
};

module.exports = resolvers;
