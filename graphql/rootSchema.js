const gql = require('../lib/gql');
const { nodeField, nodesField } = require('graphql-relay-tools');

const {
  mutationField: createOfferOfServiceField,
} = require('./mutations/createOfferOfService');

const {
  mutationField: toggleOfferOfServiceWorkflowStateField,
} = require('./mutations/toggleOfferOfServiceWorkflowState');

const {
  mutationField: assignOfferOfServiceToAdventureField,
} = require('./mutations/assignOfferOfServiceToAdventure');

const {
  mutationField: updateOfferOfServiceField,
} = require('./mutations/updateOfferOfService');

const {
  mutationField: assignManagerToAdventureField,
} = require('./mutations/assignManagerToAdventure');

const {
  mutationField: removeManagerFromAdventureField,
} = require('./mutations/removeManagerFromAdventure');

module.exports = gql`
  scalar GraphQLDate

  scalar GraphQLDateTime

  type Query {
    offerOfService(search: OfferOfServiceSearchInput!): OfferOfService
    offersOfService(filters: OfferOfServiceFilters): [OfferOfService]

    adventure(search: AdventureSearchInput!): Adventure
    adventures(filters: AdventureFilters): [Adventure]

    patrol(search: PatrolSearchInput!): Patrol
    patrols(filters: PatrolFilters): [Patrol]

    patrolScouter(search: PatrolScouterSearchInput!): PatrolScouter
    patrolScouters(filters: PatrolScouterFilters): [PatrolScouter]

    ${nodeField}
    ${nodesField}
  }

  type Mutation {
    createOfferOfService${createOfferOfServiceField},
    toggleOfferOfServiceWorkflowState${toggleOfferOfServiceWorkflowStateField}
    assignOfferOfServiceToAdventure${assignOfferOfServiceToAdventureField}
    updateOfferOfService${updateOfferOfServiceField}
    assignManagerToAdventure${assignManagerToAdventureField}
    removeManagerFromAdventure${removeManagerFromAdventureField}
  }

`;
