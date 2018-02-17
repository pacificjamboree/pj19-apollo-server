const { makeExecutableSchema } = require('graphql-tools');
const { nodeInterface, pageInfoType } = require('graphql-relay-tools');

const rootSchema = require('./rootSchema');
const enums = require('./enums');
const inputs = require('./inputs');
const resolvers = require('./resolvers');

const {
  mutationType: createOfferOfServiceType,
} = require('./mutations/createOfferOfService');

const {
  mutationType: toggleOfferOfServiceWorkflowStateType,
} = require('./mutations/toggleOfferOfServiceWorkflowState');

const {
  mutationType: assignOfferOfServiceToAdventureType,
} = require('./mutations/assignOfferOfServiceToAdventure');

const {
  mutationType: updateOfferOfServiceType,
} = require('./mutations/updateOfferOfService');

const {
  mutationType: assignManagerToAdventureType,
} = require('./mutations/assignManagerToAdventure');

const {
  mutationType: removeManagerFromAdventureType,
} = require('./mutations/removeManagerFromAdventure');

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
    createOfferOfServiceType,
    toggleOfferOfServiceWorkflowStateType,
    assignOfferOfServiceToAdventureType,
    updateOfferOfServiceType,
    assignManagerToAdventureType,
    removeManagerFromAdventureType,
    rootSchema,
  ],
  resolvers,
});
