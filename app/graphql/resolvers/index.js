const {
  nodeDefinitions,
  globalIdResolver,
  fromGlobalId,
  connectionFromArray,
} = require('graphql-relay-tools');

const {
  assignManagerToAdventure,
  assignOfferOfServiceToAdventure,
  createAdventure,
  updateAdventure,
  createOfferOfService,
  removeManagerFromAdventure,
  toggleOfferOfServiceWorkflowState,
  updateOfferOfService,
  createUser,
  updateUser,
  createPatrol,
  updatePatrol,
  createPatrolScouter,
  updatePatrolScouter,
} = require('../mutations');
const {
  getOfferOfService,
  getOffersOfService,
} = require('../resolvers/offerOfService');
const { getAdventure, getAdventures } = require('../resolvers/adventure');
const { getPatrol, getPatrols } = require('../resolvers/patrol');
const {
  getPatrolScouter,
  getPatrolScouters,
} = require('../resolvers/patrolScouter');

const { getUser } = require('../resolvers/user');

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

    case 'User':
      return getUser(searchField);
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
    patrols: (_, { filters = {} }) => getPatrols(filters),

    // patrolScouters
    patrolScouter: (_, { search }) => getPatrolScouter(search),
    patrolScouters: (_, { filters = {} }) => getPatrolScouters(filters),

    user: (_, { search }) => getUser(search),

    // nodes
    node: nodeResolver,
    nodes: nodesResolver,
  },

  Mutation: {
    createAdventure: createAdventure.mutationResolver,
    updateAdventure: updateAdventure.mutationResolver,
    createOfferOfService: createOfferOfService.mutationResolver,
    toggleOfferOfServiceWorkflowState:
      toggleOfferOfServiceWorkflowState.mutationResolver,
    assignOfferOfServiceToAdventure:
      assignOfferOfServiceToAdventure.mutationResolver,
    updateOfferOfService: updateOfferOfService.mutationResolver,
    assignManagerToAdventure: assignManagerToAdventure.mutationResolver,
    removeManagerFromAdventure: removeManagerFromAdventure.mutationResolver,
    createUser: createUser.mutationResolver,
    updateUser: updateUser.mutationResolver,
    createPatrol: createPatrol.mutationResolver,
    updatePatrol: updatePatrol.mutationResolver,
    createPatrolScouter: createPatrolScouter.mutationResolver,
    updatePatrolScouter: updatePatrolScouter.mutationResolver,
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
      connectionFromArray(patrol.patrolScouters, args),
  },
  PatrolScouter: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
    fullName: ({ firstName, lastName }) => `${firstName} ${lastName}`,
    Patrol: ({ patrolId }) =>
      getPatrol({ searchField: '_id', value: patrolId }),
  },

  User: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
    OfferOfService: ({ offerOfService }) => offerOfService,
    PatrolScouter: ({ patrolScouter }) => patrolScouter,
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
