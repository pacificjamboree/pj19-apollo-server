const { makeExecutableSchema } = require('apollo-server-express');
const { nodeInterface, pageInfoType } = require('graphql-relay-tools');

const rootSchema = require('./rootSchema');
const enums = require('./enums');
const inputs = require('./inputs');
const resolvers = require('./resolvers');

const {
  createAdventure,
  updateAdventure,

  createOfferOfService,
  toggleOfferOfServiceWorkflowState,
  assignOfferOfServiceToAdventure,
  updateOfferOfService,
  batchImportOffersOfService,

  assignManagerToAdventure,
  removeManagerFromAdventure,

  createUser,
  updateUser,

  createPatrol,
  updatePatrol,

  createPatrolScouter,
  updatePatrolScouter,

  createLoginToken,
} = require('./mutations');

const {
  Adventure,
  OfferOfService,
  OfferOfServiceNode,
  OffersOfServiceConnection,
  Patrol,
  PatrolScouter,
  PatrolScoutersConnection,
  User,
} = require('./types');

const directiveResolvers = require('./directiveResolvers');

const directives = `
  directive @isAuthenticated on FIELD | FIELD_DEFINITION 
  directive @isAuthorized(roles: [UserRoles]) on FIELD | FIELD_DEFINITION 
  directive @managerOnly on FIELD
  directive @adminOnly(throw: Boolean = true) on FIELD
`;

module.exports = makeExecutableSchema({
  typeDefs: [
    directives,
    pageInfoType,
    nodeInterface,
    Adventure,
    OfferOfService,
    OfferOfServiceNode,
    OffersOfServiceConnection,
    Patrol,
    PatrolScouter,
    PatrolScoutersConnection,
    User,
    enums,
    inputs,
    createAdventure.mutationType,
    updateAdventure.mutationType,
    createOfferOfService.mutationType,
    toggleOfferOfServiceWorkflowState.mutationType,
    assignOfferOfServiceToAdventure.mutationType,
    updateOfferOfService.mutationType,
    batchImportOffersOfService.mutationType,
    assignManagerToAdventure.mutationType,
    removeManagerFromAdventure.mutationType,
    createUser.mutationType,
    updateUser.mutationType,
    createPatrol.mutationType,
    updatePatrol.mutationType,
    createPatrolScouter.mutationType,
    updatePatrolScouter.mutationType,
    createLoginToken.mutationType,
    rootSchema,
  ],
  resolvers,
  directiveResolvers,
});
