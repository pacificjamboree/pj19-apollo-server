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
  createUsers,
  updateUser,

  createPatrol,
  updatePatrol,
  batchPatrols,

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

  updatePatrolAdventureSelection,
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
    createUsers.mutationType,
    updateUser.mutationType,
    createPatrol.mutationType,
    updatePatrol.mutationType,
    batchPatrols.mutationType,
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
    updatePatrolAdventureSelection.mutationType,
    rootSchema,
  ],
  resolvers,
  directiveResolvers,
});
