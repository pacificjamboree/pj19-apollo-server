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
    offerOfService: (_, { oosNumber }) => getOfferOfService(oosNumber),

    // adventures
    allAdventures: () => getAllAdventures(),
    adventure: (_, { adventureCode }) => getAdventure(adventureCode)
  },

  Mutation: {
    createOfferOfService: (_, data, context) => {
      return insertOfferOfService(data);
    }
  },

  OOS: {
    isYouth: ({ birthdate }) => differenceInYears(new Date(), birthdate) <= 18,
    assigned: ({ assignedAdventureId }) => !!assignedAdventureId,
    assignment: oos => getAssignmentForOOS(oos),
    fullName: ({ firstName, lastName, preferredName }) =>
      `${preferredName ? preferredName : firstName} ${lastName}`
  },
  Adventure: {
    OffersOfService: adventure => getOOSForAdventure(adventure)
  }
};

module.exports = resolvers;
