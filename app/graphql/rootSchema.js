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
} = require('./mutations');

module.exports = gql`
  scalar GraphQLDate

  scalar GraphQLDateTime

  type Query {
    offerOfService(search: OfferOfServiceSearchInput!): OfferOfService @isAuthenticated
    offersOfService(filters: OfferOfServiceFilters): [OfferOfService] @adminOnly
    offersOfServiceForAdventure(search: OfferOfServiceForAdventureSearchInput!): [OfferOfService] @isAuthenticated
    offerOfServiceCount: OfferOfServiceCount @adminOnly
    offerOfServiceOverdueAssignment: [OfferOfService] @adminOnly

    adventure(search: AdventureSearchInput!): Adventure
    adventures(filters: AdventureFilters): [Adventure]

    adventurePeriod(id: ID!): AdventurePeriod

    patrol(search: PatrolSearchInput!): Patrol @isAuthorized(roles: [admin, patrolScouter])
    patrols(filters: PatrolFilters): [Patrol] @adminOnly
    patrolStats: PatrolStats @adminOnly

    patrolScouter(search: PatrolScouterSearchInput!): PatrolScouter @adminOnly
    patrolScouters(filters: PatrolScouterFilters): [PatrolScouter] @adminOnly

    patrolAdventureSelection(search: PatrolAdventureSelectionSearchInput!): PatrolAdventureSelection
    patrolAdventureSelectionStats: PatrolAdventureSelectionStats @adminOnly
    
    user(search: UserSearchInput!): User @adminOnly

    adventureGuideMarkdown: TextContent
    textContent(search: TextContentSearchInput!): TextContent

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
    createUsers${createUsers.mutationField} @adminOnly
    updateUser${updateUser.mutationField} @adminOnly
    createPatrol${createPatrol.mutationField} @adminOnly
    updatePatrol${updatePatrol.mutationField} @adminOnly
    updatePatrols${updatePatrols.mutationField} @adminOnly
    batchPatrols${batchPatrols.mutationField} @adminOnly
    createPatrolScouter${createPatrolScouter.mutationField} @adminOnly
    updatePatrolScouter${updatePatrolScouter.mutationField} @adminOnly
    createLoginToken${createLoginToken.mutationField} 
    sendOfferOfServiceWelcomeEmail${
      sendOfferOfServiceWelcomeEmail.mutationField
    } @adminOnly
    sendOfferOfServiceOverdueEmail${
      sendOfferOfServiceOverdueEmail.mutationField
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
    sendPatrolWelcomeMessage${sendPatrolWelcomeMessage.mutationField} @adminOnly
    sendPasswordResetEmail${sendPasswordResetEmail.mutationField}
    resetPassword${resetPassword.mutationField}
    updateAdventureGuide${updateAdventureGuide.mutationField} @adminOnly
    updatePatrolAdventureSelection${
      updatePatrolAdventureSelection.mutationField
    }
    removeAdventureFromAllPatrolAdventureSelections${
      removeAdventureFromAllPatrolAdventureSelections.mutationField
    } @adminOnly
    addAdventurePeriodToPatrolSchedule${
      addAdventurePeriodToPatrolSchedule.mutationField
    } @adminOnly
    removeAdventurePeriodFromPatrolSchedule${
      removeAdventurePeriodFromPatrolSchedule.mutationField
    } @adminOnly
  }
`;
