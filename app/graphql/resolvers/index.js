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
  sendPasswordResetEmail,
  resetPassword,
} = require('../mutations');
const {
  getOfferOfService,
  getOffersOfService,
  getOffersOfServiceForAdventure,
  totalOfferOfServiceAllocatedCount,
  totalAdultOfferOfServiceAllocatedCount,
  totalAssignedOfferOfServiceCount,
  totalUnassignedOfferOfServiceCount,
  totalOOSRequiredCount,
  totalAdultOOSRequiredCount,
  offerOfServiceOverdueAssignment,
} = require('../resolvers/offerOfService');
const { getAdventure, getAdventures } = require('../resolvers/adventure');
const { getPatrol, getPatrols } = require('../resolvers/patrol');
const {
  getPatrolScouter,
  getPatrolScouters,
} = require('../resolvers/patrolScouter');

const { getUser } = require('../resolvers/user');
const { getViewer } = require('../resolvers/viewer');
const { getTextContent } = require('../resolvers/textContent');
const { UnauthorizedActionError } = require('../errors');
const { GraphQLDate, GraphQLDateTime } = require('graphql-iso-date');
const { Adventure } = require('../../models');

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
    offerOfService: async function(_, { search }, { user }) {
      const oos = await getOfferOfService(search);
      if (
        // must be an admin
        user.roles.includes('admin') ||
        // or a manager of the adventure to which the oos is assigned
        (user.roles.includes('adventureManager') &&
          oos.assignment.managers.map(x => x.id).includes(user.oosId)) ||
        // or the actual oos
        user.oosId === oos.id
      ) {
        return oos;
      } else {
        throw new UnauthorizedActionError();
      }
    },
    offersOfService: (_, { filters = {} }) => getOffersOfService(filters),

    offersOfServiceForAdventure: async (_, { search }, { user }) => {
      const adventure = await getAdventure(search);
      if (
        user.roles.includes('admin') ||
        (user.roles.includes('adventureManager') &&
          adventure.managers.map(x => x.id).includes(user.oosId))
      ) {
        return getOffersOfServiceForAdventure(search);
      } else {
        throw new UnauthorizedActionError();
      }
    },

    offerOfServiceCount: () => ({}),

    offerOfServiceOverdueAssignment: () => offerOfServiceOverdueAssignment(),

    // adventures
    adventure: (_, { search }) => getAdventure(search),
    adventures: (_, { filters = {} }) => getAdventures(filters),

    // patrols
    patrol: (_, { search }) => getPatrol(search),
    patrols: (_, { filters = {} }) => getPatrols(filters),

    // patrolScouters
    patrolScouter: (_, { search }) => getPatrolScouter(search),
    patrolScouters: (_, { filters = {} }) => getPatrolScouters(filters),

    textContent: (_, { search }) => getTextContent(search),

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
    sendPasswordResetEmail: sendPasswordResetEmail.mutationResolver,
    resetPassword: resetPassword.mutationResolver,
  },

  OfferOfServiceCount: {
    required: () => totalOOSRequiredCount(),
    adultRequired: () => totalAdultOOSRequiredCount(),
    allocated: () => totalOfferOfServiceAllocatedCount(),
    adultAllocated: () => totalAdultOfferOfServiceAllocatedCount(),
    assigned: () => totalAssignedOfferOfServiceCount(),
    unassigned: () => totalUnassignedOfferOfServiceCount(),
  },

  OfferOfService: {
    ...baseOfferOfServiceFieldResolvers,
    assigned: o => o.assigned(),
    assignment: o => o.assignment,
    isAdventureManager: async o => await o.isAdventureManager(),
  },
  OfferOfServiceNode: baseOfferOfServiceFieldResolvers,
  Adventure: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
    fullName: ({ name, themeName }) =>
      themeName ? `${themeName} (${name})` : name,
    pdrPlan: ({ pdrPlan }) => pdrPlan || [],
    pdrDo: ({ pdrDo }) => pdrDo || [],
    pdrReview: ({ pdrReview }) => pdrReview || [],
    pdrSafetyTips: ({ pdrSafetyTips }) => pdrSafetyTips || [],
    adultOOSRequired: adventure => adventure.adultOosRequired,
    oosAssignedCount: adventure => adventure.offersOfService.length,
    adultOOSAssignedCount: adventure =>
      adventure.offersOfService.filter(o => !o.isYouth).length,
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

  PatrolAdventureSelection: {
    selectionOrder: ({ selectionOrder }) =>
      Adventure.query().whereIn('id', selectionOrder),
  },

  TextContent: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
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
