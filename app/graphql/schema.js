const { makeExecutableSchema } = require('graphql-tools');
const { nodeInterface, pageInfoType } = require('graphql-relay-tools');

const rootSchema = require('./rootSchema');
const enums = require('./enums');
const inputs = require('./inputs');
const resolvers = require('./resolvers');

const {
  createAdventure,

  createOfferOfService,
  toggleOfferOfServiceWorkflowState,
  assignOfferOfServiceToAdventure,
  updateOfferOfService,

  assignManagerToAdventure,
  removeManagerFromAdventure,

  createUser,
  updateUser,

  createPatrol,
  updatePatrol,

  createPatrolScouter,
} = require('./mutations');

const {
  Adventure,
  OfferOfService,
  OffersOfServiceConnection,
  Patrol,
  PatrolScouter,
  PatrolScoutersConnection,
  User,
} = require('./types');

module.exports = makeExecutableSchema({
  typeDefs: [
    pageInfoType,
    nodeInterface,
    Adventure,
    OfferOfService,
    OffersOfServiceConnection,
    Patrol,
    PatrolScouter,
    PatrolScoutersConnection,
    User,
    enums,
    inputs,
    createAdventure.mutationType,
    createOfferOfService.mutationType,
    toggleOfferOfServiceWorkflowState.mutationType,
    assignOfferOfServiceToAdventure.mutationType,
    updateOfferOfService.mutationType,
    assignManagerToAdventure.mutationType,
    removeManagerFromAdventure.mutationType,
    createUser.mutationType,
    updateUser.mutationType,
    createPatrol.mutationType,
    updatePatrol.mutationType,
    createPatrolScouter.mutationType,
    rootSchema,
  ],
  resolvers,
});
