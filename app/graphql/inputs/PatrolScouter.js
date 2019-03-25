const gql = require('../gql');
module.exports = gql`
  input PatrolScouterSearchInput {
    searchField: PatrolScouterSearchFields!
    value: String!
  }

  input PatrolScouterFilters {
    workflowState: [WorkflowState]
    email: String
    patrolNumber: String
    importId: String
  }

  input PatrolScouterDraft {
    email: String!
    patrolId: String!
    workflowState: WorkflowState
  }

  input PatrolScouterUpdate {
    email: String
    patrolId: String
    workflowState: WorkflowState
  }
`;
