const gql = require('../gql');
module.exports = gql`
  input PatrolFilters {
    workflowState: [WorkflowState]
    name: String
    fullyPaid: Boolean
  }

  input PatrolSearchInput {
    searchField: PatrolSearchFields!
    value: String!
  }
`;
