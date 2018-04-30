const gql = require('../gql');
module.exports = gql`
  input PatrolFilters {
    workflowState: [WorkflowState]
    name: String
    fullyPaid: Boolean
  }

  input PatrolDraft {
    patrolNumber: String!
    name: String!
    numberOfScouts: Int!
    numberOfScouters: Int!
    finalPaymentReceived: GraphQLDate
    workflowState: WorkflowState
  }

  input PatrolUpdate {
    patrolNumber: String
    name: String
    numberOfScouts: Int
    numberOfScouters: Int
    finalPaymentReceived: GraphQLDate
    workflowState: WorkflowState
  }

  input PatrolSearchInput {
    searchField: PatrolSearchFields!
    value: String!
  }
`;
