const {
  getAllOffersOfService,
  getOfferOfService,
  getAssignmentForOOS,
  insertOfferOfService,
  getAllAdventures,
  getAdventure,
  getOOSForAdventure
} = require('./knex_connector');
const differenceInYears = require('date-fns/difference_in_years');
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

  Mutation: {
    createOfferOfService: (_, data, context) => {
      return insertOfferOfService(data);
    }
  },

  OOS: {
    is_youth: ({ birthdate }) => differenceInYears(new Date(), birthdate) <= 18,
    assigned: ({ assigned_adventure_id }) => !!assigned_adventure_id,
    assignment: oos => getAssignmentForOOS(oos),
    full_name: ({ first_name, last_name, preferred_name }) =>
      `${preferred_name ? preferred_name : first_name} ${last_name}`
  },
  Adventure: {
    offers_of_service: adventure => getOOSForAdventure(adventure)
  }
};

module.exports = resolvers;
