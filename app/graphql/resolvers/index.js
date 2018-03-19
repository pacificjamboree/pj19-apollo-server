const {
  nodeDefinitions,
  globalIdResolver,
  fromGlobalId,
  connectionFromArray,
  connectionFromPromisedArray,
} = require('graphql-relay-tools');

const {
  mutationResolver: createOfferOfServiceResolver,
} = require('../mutations/createOfferOfService');

const {
  mutationResolver: toggleOfferOfServiceWorkflowStateResolver,
} = require('../mutations/toggleOfferOfServiceWorkflowState');

const {
  mutationResolver: assignOfferOfServiceToAdventureResolver,
} = require('../mutations/assignOfferOfServiceToAdventure');

const {
  mutationResolver: updateOfferOfServiceResolver,
} = require('../mutations/updateOfferOfService');

const {
  mutationResolver: assignManagerToAdventureResolver,
} = require('../mutations/assignManagerToAdventure');

const {
  mutationResolver: removeManagerFromAdventureResolver,
} = require('../mutations/removeManagerFromAdventure');

const {
  getAllPatrols,
  getPatrol,
  getScoutersForPatrol,
  getPatrolScouter,
  getAllPatrolScouters,
} = require('../knex_connector');

const {
  getOfferOfService,
  getOffersOfService,
} = require('../resolvers/offerOfService');

const { getAdventure, getAdventures } = require('../resolvers/adventure');

const { GraphQLDate, GraphQLDateTime } = require('graphql-iso-date');

const { nodeResolver, nodesResolver } = nodeDefinitions(globalId => {
  const { type, id } = fromGlobalId(globalId);
  const searchField = { searchField: '_id', value: id };
  switch (type) {
    case 'OfferOfService':
      return getOfferOfService(searchField);

    case 'Patrol':
      return getPatrol(searchField);

    case 'Adventure':
      return getAdventure(searchField);

    case 'PatrolScouter':
      return getPatrolScouter(searchField);
  }
  return null;
});

module.exports = {
  GraphQLDate,
  GraphQLDateTime,
  Query: {
    // offers of service
    offerOfService: (_, { search }) => getOfferOfService(search),
    offersOfService: (_, { filters = {} }) => getOffersOfService(filters),

    // adventures
    adventure: (_, { search }) => getAdventure(search),
    adventures: (_, { filters = {} }) => getAdventures(filters),

    // patrols
    patrol: (_, { search }) => getPatrol(search),
    patrols: (_, { filters = {} }) => getAllPatrols(filters),

    // patrolScouters
    patrolScouter: (_, { search }) => getPatrolScouter(search),
    patrolScouters: (_, { filters = {} }) => getAllPatrolScouters(filters),

    // nodes
    node: nodeResolver,
    nodes: nodesResolver,
  },

  Mutation: {
    createOfferOfService: createOfferOfServiceResolver,
    toggleOfferOfServiceWorkflowState: toggleOfferOfServiceWorkflowStateResolver,
    assignOfferOfServiceToAdventure: assignOfferOfServiceToAdventureResolver,
    updateOfferOfService: updateOfferOfServiceResolver,
    assignManagerToAdventure: assignManagerToAdventureResolver,
    removeManagerFromAdventure: removeManagerFromAdventureResolver,
  },

  OfferOfService: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
    isYouth: o => o.isYouth(),
    assigned: o => o.assigned(),
    assignment: o => o.assignment,
    fullName: o => o.fullName(),
  },
  Adventure: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
    OffersOfServiceConnection: (adventure, args) =>
      connectionFromArray(adventure.offersOfService, args),
    ManagersConnection: (adventure, args) =>
      connectionFromArray(adventure.managers, args),
  },
  Patrol: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
    fullyPaid: ({ finalPaymentReceived }) => !!finalPaymentReceived,
    totalUnitSize: ({ numberOfScouts, numberOfScouters }) =>
      numberOfScouts + numberOfScouters,
    PatrolScoutersConnection: (patrol, args) =>
      connectionFromPromisedArray(getScoutersForPatrol(patrol), args),
  },
  PatrolScouter: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
    fullName: ({ firstName, lastName }) => `${firstName} ${lastName}`,
    Patrol: ({ patrolId }) =>
      getPatrol({ searchField: '_id', value: patrolId }),
  },

  Node: {
    id: globalIdResolver(),
    __resolveType(obj, context, info) {
      if (obj.$type) {
        return obj.$type;
      }

      try {
        return obj.constructor.name;
      } catch (e) {
        return null;
      }
    },
  },
};
