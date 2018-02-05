const {
  getAllOffersOfService,
  getOfferOfService,
  getAssignmentForOOS,
  insertOfferOfService,
  toggleOOSWorkflowState,
  getAllAdventures,
  getAdventure,
  getOOSForAdventure,
  changeOOSAssignment,
  updateOOS,
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
    adventure: (_, { adventureCode }) => getAdventure(adventureCode),
  },

  Mutation: {
    createOfferOfService: (_, data, context) => insertOfferOfService(data),

    toggleOfferOfServiceWorkflowStateById: (
      _,
      { input: { id, workflowState } }
    ) => toggleOOSWorkflowState({ id, workflowState }),

    toggleOfferOfServiceWorkflowStateOOSNumber: (
      _,
      { input: { oosNumber, workflowState } }
    ) => toggleOOSWorkflowState({ oosNumber, workflowState }),

    assignOfferOfServiceToAdventure: (_, { input: { oosId, assignmentId } }) =>
      changeOOSAssignment(oosId, assignmentId),

    updateOfferOfService: (_, { oosId, input }) => updateOOS(oosId, input),
  },

  OOS: {
    isYouth: ({ birthdate }) => differenceInYears(new Date(), birthdate) <= 18,
    assigned: ({ assignedAdventureId }) => !!assignedAdventureId,
    assignment: oos => getAssignmentForOOS(oos),
    fullName: ({ firstName, lastName, preferredName }) =>
      `${preferredName ? preferredName : firstName} ${lastName}`,
  },
  Adventure: {
    OffersOfService: adventure => getOOSForAdventure(adventure),
  },
};

module.exports = resolvers;
