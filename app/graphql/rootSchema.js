const gql = require('./gql');
const { nodeField, nodesField } = require('graphql-relay-tools');

const {
  createAdventure,
  updateAdventure,
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
  updatePatrolScouter,
  createLoginToken,
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
    createAdventure${createAdventure.mutationField}
    updateAdventure${updateAdventure.mutationField}
    createOfferOfService${createOfferOfService.mutationField}
    toggleOfferOfServiceWorkflowState${
      toggleOfferOfServiceWorkflowState.mutationField
    }
    assignOfferOfServiceToAdventure${
      assignOfferOfServiceToAdventure.mutationField
    }
    updateOfferOfService${updateOfferOfService.mutationField}
    assignManagerToAdventure${assignManagerToAdventure.mutationField}
    removeManagerFromAdventure${removeManagerFromAdventure.mutationField}
    createUser${createUser.mutationField}
    updateUser${updateUser.mutationField}
    createPatrol${createPatrol.mutationField}
    updatePatrol${updatePatrol.mutationField}
    createPatrolScouter${createPatrolScouter.mutationField}
    updatePatrolScouter${updatePatrolScouter.mutationField}
    createLoginToken${createLoginToken.mutationField}
  }
`;
