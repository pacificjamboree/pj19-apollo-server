const toc = require('markdown-toc');
const slugify = require('slugify');

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
  createUsers,
  updateUser,
  createPatrol,
  updatePatrol,
  updatePatrols,
  batchPatrols,
  createPatrolScouter,
  updatePatrolScouter,
  createLoginToken,
  sendOfferOfServiceWelcomeEmail,
  sendOfferOfServiceWelcomeEmailBatch,
  sendOfferOfServiceAssignmentEmail,
  sendOfferOfServiceAssignmentEmailBatch,
  sendOfferOfServiceWelcomeMessagesBulk,
  sendOfferOfServiceOverdueEmail,
  sendPatrolWelcomeMessage,
  sendPasswordResetEmail,
  resetPassword,
  updateAdventureGuide,
  updatePatrolAdventureSelection,
  removeAdventureFromAllPatrolAdventureSelections,
  addAdventurePeriodToPatrolSchedule,
  removeAdventurePeriodFromPatrolSchedule,
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
const { getAdventurePeriodById } = require('./adventurePeriod');
const {
  getPatrol,
  getPatrols,
  totalPatrolCount,
  totalScoutsCount,
  totalScoutersCount,
  patrolsWithThreeScouters,
  totalParticipantsCount,
  totalAdventureParticipantsCount,
} = require('../resolvers/patrol');
const {
  getPatrolScouter,
  getPatrolScouters,
} = require('../resolvers/patrolScouter');
const {
  getPatrolAdventureSelection,
  getPatrolAdventureSelections,
  patrolAdventureSelectionStats,
} = require('../resolvers/patrolAdventureSelection');

const { adventureLoadingReportForDay } = require('../resolvers/loadingReport');

const { getUser } = require('../resolvers/user');
const { getViewer } = require('../resolvers/viewer');
const { generateAdventureGuideMarkdown } = require('./adventureGuide');
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

    case 'PatrolAdventureSelection':
      return getPatrolAdventureSelection(searchField);

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

    // adventurePeriods
    adventurePeriod: (_, { id }) => getAdventurePeriodById(id),

    // patrols
    patrol: (_, { search }, ctx) => getPatrol(search, ctx),
    patrols: (_, { filters = {} }) => getPatrols(filters),

    patrolStats: () => ({}),
    // patrolScouters
    patrolScouter: (_, { search }) => getPatrolScouter(search),
    patrolScouters: (_, { filters = {} }) => getPatrolScouters(filters),

    // patrolAdventureSelections
    patrolAdventureSelection: (_, { search }) =>
      getPatrolAdventureSelection(search),
    // patrolAdventureSelections: (_, { filters }) =>

    patrolAdventureSelectionStats: (_, { filters = {} }) =>
      getPatrolAdventureSelections(),

    adventureGuideMarkdown: () => generateAdventureGuideMarkdown(),
    textContent: (_, { search }) => getTextContent(search),

    user: (_, { search }) => getUser(search),

    adventureLoadingReportForDay: (_, { day }) =>
      adventureLoadingReportForDay(day),

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
    createUsers: createUsers.mutationResolver,
    updateUser: updateUser.mutationResolver,
    createPatrol: createPatrol.mutationResolver,
    updatePatrol: updatePatrol.mutationResolver,
    updatePatrols: updatePatrols.mutationResolver,
    batchPatrols: batchPatrols.mutationResolver,
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
    sendOfferOfServiceOverdueEmail:
      sendOfferOfServiceOverdueEmail.mutationResolver,
    sendPasswordResetEmail: sendPasswordResetEmail.mutationResolver,
    sendPatrolWelcomeMessage: sendPatrolWelcomeMessage.mutationResolver,
    resetPassword: resetPassword.mutationResolver,
    updateAdventureGuide: updateAdventureGuide.mutationResolver,
    updatePatrolAdventureSelection:
      updatePatrolAdventureSelection.mutationResolver,
    removeAdventureFromAllPatrolAdventureSelections:
      removeAdventureFromAllPatrolAdventureSelections.mutationResolver,
    addAdventurePeriodToPatrolSchedule:
      addAdventurePeriodToPatrolSchedule.mutationResolver,
    removeAdventurePeriodFromPatrolSchedule:
      removeAdventurePeriodFromPatrolSchedule.mutationResolver,
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
    managesAdventures: async o => await o.manages(),
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
    adventurePeriods: async adventure =>
      adventure
        .$relatedQuery('periods')
        .where('type', 'primary')
        .orderBy('startAt'),
  },

  AdventurePeriod: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
    participantsAssigned: period => period.participantsAssigned(),
    patrols: period => period.$relatedQuery('patrols').eager('patrolScouter'),
    adventure: period =>
      period.adventure ? period.adventure : period.$relatedQuery('adventure'),
    patrolsAssignedCount: period => period.patrolsAssigned(),
    capacityRemaining: period => period.capacityRemaining(),
  },

  Patrol: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
    fullyPaid: ({ finalPaymentDate }) => !!finalPaymentDate,
    totalUnitSize: ({ numberOfScouts, numberOfScouters }) =>
      numberOfScouts + numberOfScouters,
    fullyScheduled: async patrol => {
      const hoursScheduled = await patrol.hoursScheduled();
      return hoursScheduled === 33;
    },
    schedule: patrol => ({
      hoursScheduled: patrol.hoursScheduled(),
      periods: patrol
        .$relatedQuery('schedule')
        .eager('adventure')
        .orderBy('startAt', 'asc'),
    }),
    numberOfFreePeriods: patrol => patrol.numberOfFreePeriods(),
  },

  PatrolScouter: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
    Patrols: patrolScouter => patrolScouter.patrols,
  },

  PatrolStats: {
    numberOfPatrols: () => totalPatrolCount(),
    totalScouts: () => totalScoutsCount(),
    totalScouters: () => totalScoutersCount(),
    patrolsWithThreeScouters: () => patrolsWithThreeScouters(),
    totalParticipants: () => totalParticipantsCount(),
    totalAdventureParticipants: () => totalAdventureParticipantsCount(),
  },

  PatrolAdventureSelection: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
    selectionOrder: ({ selectionOrder }) => {
      return Promise.all(
        selectionOrder.map(id =>
          Adventure.query()
            .select('*')
            .where({ id })
            .first()
        )
      );
    },
  },

  PatrolAdventureSelectionStats: {
    defined: selections =>
      selections.filter(({ workflowState }) => workflowState === 'defined')
        .length,
    draft: selections =>
      selections.filter(({ workflowState }) => workflowState === 'draft')
        .length,
    saved: selections =>
      selections.filter(({ workflowState }) => workflowState === 'saved')
        .length,
    total: selections => selections.length,
    wantExtraFreePeriod: selections =>
      selections.filter(
        ({ workflowState, wantExtraFreePeriod }) =>
          wantExtraFreePeriod &&
          (workflowState === 'saved' || workflowState === 'locked')
      ).length,
    selectionRankings: () => patrolAdventureSelectionStats(),
  },

  TextContent: {
    id: globalIdResolver(),
    _id: ({ id }) => id,
    toc: ({ body }) =>
      toc(body, {
        firsth1: false,
        slugify: body => slugify(body).toLowerCase(),
      }).content,
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
