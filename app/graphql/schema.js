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
  batchImportPatrols,

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

  updateAdventureGuide,
} = require('./mutations');

const {
  Adventure,
  OfferOfService,
  OfferOfServiceNode,
  OfferOfServiceCount,
  OffersOfServiceConnection,
  Patrol,
  PatrolScouter,
  PatrolAdventureSelection,
  TextContent,
  User,
} = require('./types');

const directiveResolvers = require('./directiveResolvers');

const directives = `
  directive @isAuthenticated on FIELD_DEFINITION 
  directive @isAuthorized(roles: [UserRoles]) on FIELD_DEFINITION 
  directive @managerOnly on FIELD_DEFINITION
  directive @adminOnly(throw: Boolean = true) on FIELD_DEFINITION
`;

module.exports = makeExecutableSchema({
  typeDefs: [
    directives,
    pageInfoType,
    nodeInterface,
    Adventure,
    OfferOfService,
    OfferOfServiceCount,
    OfferOfServiceNode,
    OffersOfServiceConnection,
    Patrol,
    PatrolScouter,
    PatrolAdventureSelection,
    TextContent,
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
    batchImportPatrols.mutationType,
    createPatrolScouter.mutationType,
    updatePatrolScouter.mutationType,
    createLoginToken.mutationType,
    sendOfferOfServiceWelcomeEmail.mutationType,
    sendOfferOfServiceWelcomeEmailBatch.mutationType,
    sendOfferOfServiceAssignmentEmail.mutationType,
    sendOfferOfServiceAssignmentEmailBatch.mutationType,
    sendOfferOfServiceWelcomeMessagesBulk.mutationType,
    sendPasswordResetEmail.mutationType,
    resetPassword.mutationType,
    updateAdventureGuide.mutationType,
    rootSchema,
  ],
  resolvers,
  directiveResolvers,
});
