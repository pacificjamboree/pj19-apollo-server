const gql = require('../gql');
module.exports = gql`
  input PatrolScouterSearchInput {
    searchField: PatrolScouterSearchFields!
    value: String!
  }

  input PatrolScouterFilters {
    workflowState: [WorkflowState]
    name: String
    patrolNumber: String
  }

  input PatrolScouterDraft {
    firstName: String!
    lastName: String!
    email: String!
    patrolId: String!
    workflowState: WorkflowState
  }
`;
