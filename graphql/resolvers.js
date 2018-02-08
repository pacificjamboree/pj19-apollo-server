const {
  getAllOffersOfService,
  getOfferOfService,
  getAssignmentForOOS,
  insertOfferOfService,
  toggleOOSWorkflowState,
  getAllAdventures,
  getAdventure,
  getOOSForAdventure,
  getManagersForAdventure,
  assignManagerToAdventure,
  removeManagerFromAdventure,
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
    offerOfService: (_, { search }) => getOfferOfService(search),

    // adventures
    allAdventures: (_, { filters }) => getAllAdventures(filters),
    adventure: (_, { search }) => getAdventure(search),
  },

  Mutation: {
    createOfferOfService: (_, data, context) => insertOfferOfService(data),

    toggleOfferOfServiceWorkflowStateById: (
      _,
      { oosId, input: { workflowState } }
    ) => toggleOOSWorkflowState({ id: oosId, workflowState }),

    toggleOfferOfServiceWorkflowStateByOOSNumber: (
      _,
      { oosNumber, input: { workflowState } }
    ) => toggleOOSWorkflowState({ oosNumber, workflowState }),

    assignOfferOfServiceToAdventure: (_, { oosId, input: { adventureId } }) =>
      changeOOSAssignment(oosId, adventureId),

    updateOfferOfService: (_, { oosId, input }) => updateOOS(oosId, input),

    assignManagerToAdventure: (_, { adventureId, input }) => {
      return assignManagerToAdventure(adventureId, input);
    },
    removeManagerFromAdventure: (_, { adventureId, input }) =>
      removeManagerFromAdventure(adventureId, input),
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
    Managers: adventure => getManagersForAdventure(adventure),
  },
};

module.exports = resolvers;
