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
  },
  OOS: {
    assignment: oos => getAssignmentForOOS(oos),
    full_name: ({ first_name, last_name, preferred_name }) =>
      `${preferred_name ? preferred_name : first_name} ${last_name}`
  }
};

module.exports = resolvers;
