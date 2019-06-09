const gql = require('../gql');
module.exports = gql`
  input PatrolFilters {
    workflowState: [WorkflowState]
    name: String
    fullyPaid: Boolean
    scheduleStatus: PatrolScheduleStatus
  }

  input PatrolDraft {
    patrolNumber: String!
    name: String!
    numberOfScouts: Int!
    numberOfScouters: Int!
    finalPaymentDate: GraphQLDate
    workflowState: WorkflowState
  }

  input PatrolUpdate {
    id: ID!
    patrolNumber: String
    groupName: String
    patrolName: String
    subcamp: Subcamp
    numberOfScouts: Int
    numberOfScouters: Int
    finalPaymentDate: GraphQLDate
    workflowState: WorkflowState
  }

  input PatrolPatch {
    id: ID!
    patrolScouterId: ID
    patrolNumber: String
    groupName: String
    patrolName: String
    subcamp: Subcamp
    numberOfScouts: Int
    numberOfScouters: Int
    email: String
    finalPaymentDate: GraphQLDate
    workflowState: WorkflowState
  }

  input PatrolSearchInput {
    searchField: PatrolSearchFields!
    value: String!
  }

  input PatrolImportDraft {
    patrolNumber: String!
    groupName: String!
    patrolName: String!
    subcamp: Subcamp!
    email: String!
    numberOfScouts: Int!
    numberOfScouters: Int!
    importId: String
  }
`;
