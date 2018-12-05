const gql = require('./gql');
const { nodeField, nodesField } = require('graphql-relay-tools');

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
  sendOfferOfServiceWelcomeEmail,
  sendOfferOfServiceWelcomeEmailBatch,
  sendOfferOfServiceAssignmentEmail,
  sendOfferOfServiceAssignmentEmailBatch,
  sendOfferOfServiceWelcomeMessagesBulk,
} = require('./mutations');

module.exports = gql`
  scalar GraphQLDate

  scalar GraphQLDateTime

  type Query {
    offerOfService(search: OfferOfServiceSearchInput!): OfferOfService @adminOnly
    offersOfService(filters: OfferOfServiceFilters): [OfferOfService] @adminOnly

    adventure(search: AdventureSearchInput!): Adventure
    adventures(filters: AdventureFilters): [Adventure]

    patrol(search: PatrolSearchInput!): Patrol @adminOnly
    patrols(filters: PatrolFilters): [Patrol] @adminOnly

    patrolScouter(search: PatrolScouterSearchInput!): PatrolScouter @adminOnly
    patrolScouters(filters: PatrolScouterFilters): [PatrolScouter] @adminOnly

    user(search: UserSearchInput!): User @adminOnly

    viewer: User

    ${nodeField}
    ${nodesField}
  }

  type Mutation {
    createAdventure${createAdventure.mutationField} @adminOnly
    updateAdventure${updateAdventure.mutationField}
    createOfferOfService${createOfferOfService.mutationField} @adminOnly
    toggleOfferOfServiceWorkflowState${
      toggleOfferOfServiceWorkflowState.mutationField
    } @adminOnly
    assignOfferOfServiceToAdventure${
      assignOfferOfServiceToAdventure.mutationField
    } @adminOnly
    updateOfferOfService${updateOfferOfService.mutationField} @adminOnly
    batchImportOffersOfService${
      batchImportOffersOfService.mutationField
    } @adminOnly
    assignManagerToAdventure${assignManagerToAdventure.mutationField} @adminOnly
    removeManagerFromAdventure${
      removeManagerFromAdventure.mutationField
    } @adminOnly
    createUser${createUser.mutationField} @adminOnly
    updateUser${updateUser.mutationField} @adminOnly
    createPatrol${createPatrol.mutationField} @adminOnly
    updatePatrol${updatePatrol.mutationField} @adminOnly
    createPatrolScouter${createPatrolScouter.mutationField} @adminOnly
    updatePatrolScouter${updatePatrolScouter.mutationField} @adminOnly
    createLoginToken${createLoginToken.mutationField} 
    sendOfferOfServiceWelcomeEmail${
      sendOfferOfServiceWelcomeEmail.mutationField
    } @adminOnly
    sendOfferOfServiceWelcomeEmailBatch${
      sendOfferOfServiceWelcomeEmailBatch.mutationField
    } @adminOnly
    sendOfferOfServiceAssignmentEmail${
      sendOfferOfServiceAssignmentEmail.mutationField
    } @adminOnly
    sendOfferOfServiceAssignmentEmailBatch${
      sendOfferOfServiceAssignmentEmailBatch.mutationField
    } @adminOnly
    sendOfferOfServiceWelcomeMessagesBulk${
      sendOfferOfServiceWelcomeMessagesBulk.mutationField
    } @adminOnly
  }
`;
