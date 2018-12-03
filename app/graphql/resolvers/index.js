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
  batchImportOffersOfService,
  createUser,
  updateUser,
  createPatrol,
  updatePatrol,
  createPatrolScouter,
  updatePatrolScouter,
  createLoginToken,
  sendOfferOfServiceWelcomeEmail,
  sendOfferOfServiceWelcomeEmailBatch,
  sendOfferOfServiceAssignmentEmail,
  sendOfferOfServiceAssignmentEmailBatch,
  sendOfferOfServiceWelcomeMessagesBulk,
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

const { getViewer } = require('../resolvers/viewer');

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

const baseOfferOfServiceFieldResolvers = {
  id: globalIdResolver(),
  _id: ({ id }) => id,
  fullName: o => o.fullName(),
};

module.exports = {
  GraphQLDate,
  GraphQLDateTime,
  Query: {
    viewer: (_, __, { user }) => (user ? getViewer(user.id) : null),

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
    batchImportOffersOfService: batchImportOffersOfService.mutationResolver,
    assignManagerToAdventure: assignManagerToAdventure.mutationResolver,
    removeManagerFromAdventure: removeManagerFromAdventure.mutationResolver,
    createUser: createUser.mutationResolver,
    updateUser: updateUser.mutationResolver,
    createPatrol: createPatrol.mutationResolver,
    updatePatrol: updatePatrol.mutationResolver,
    createPatrolScouter: createPatrolScouter.mutationResolver,
    updatePatrolScouter: updatePatrolScouter.mutationResolver,
    createLoginToken: createLoginToken.mutationResolver,
    sendOfferOfServiceWelcomeEmail:
      sendOfferOfServiceWelcomeEmail.mutationResolver,
    sendOfferOfServiceWelcomeEmailBatch:
      sendOfferOfServiceWelcomeEmailBatch.mutationResolver,
    sendOfferOfServiceAssignmentEmail:
      sendOfferOfServiceAssignmentEmail.mutationResolver,
    sendOfferOfServiceAssignmentEmailBatch:
      sendOfferOfServiceAssignmentEmailBatch.mutationResolver,
    sendOfferOfServiceWelcomeMessagesBulk:
      sendOfferOfServiceWelcomeMessagesBulk.mutationResolver,
  },

  OfferOfService: {
    ...baseOfferOfServiceFieldResolvers,
    assigned: o => o.assigned(),
    assignment: o => o.assignment,
  },
  OfferOfServiceNode: baseOfferOfServiceFieldResolvers,
  Adventure: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
    pdrPlan: ({ pdrPlan }) => pdrPlan || [],
    pdrDo: ({ pdrDo }) => pdrDo || [],
    pdrReview: ({ pdrReview }) => pdrReview || [],
    pdrSafetyTips: ({ pdrSafetyTips }) => pdrSafetyTips || [],
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
    roles: async user => await user.calculateRoles(),
    isAdmin: async user => await user.isAdmin(),
    isOfferOfService: user => user.isOfferOfService(),
    isPatrolScouter: user => user.isPatrolScouter(),
    isAdventureManager: async user => user.isAdventureManager(),
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
