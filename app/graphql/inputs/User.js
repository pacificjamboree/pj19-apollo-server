const gql = require('../gql');
module.exports = gql`
  input UserSearchInput {
    searchField: UserSearchFields!
    value: String!
  }

  input UserUpdateInput {
    username: String!
    oosId: String
    admin: String
    workflowState: WorkflowState
  }
`;
