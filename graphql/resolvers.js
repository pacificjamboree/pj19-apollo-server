const {
  getAllOffersOfService,
  getOfferOfService,
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
  }
};

module.exports = resolvers;
