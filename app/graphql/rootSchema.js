const gql = require('./gql');
const { nodeField, nodesField } = require('graphql-relay-tools');

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
  updatePatrolScouter,
} = require('./mutations');

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

    user(search: UserSearchInput!): User

    ${nodeField}
    ${nodesField}
  }

  type Mutation {
    createAdventure${createAdventure.mutationField}
    createOfferOfService${createOfferOfService.mutationField},
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
  }
`;
