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
} = require('./mutations');

const {
  Adventure,
  OfferOfService,
  OffersOfServiceConnection,
  Patrol,
  PatrolScouter,
  PatrolScoutersConnection,
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
    enums,
    inputs,
    createAdventure.mutationType,
    createOfferOfService.mutationType,
    toggleOfferOfServiceWorkflowState.mutationType,
    assignOfferOfServiceToAdventure.mutationType,
    updateOfferOfService.mutationType,
    assignManagerToAdventure.mutationType,
    removeManagerFromAdventure.mutationType,
    rootSchema,
  ],
  resolvers,
});
