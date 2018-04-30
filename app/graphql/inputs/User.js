const gql = require('../gql');
module.exports = gql`
  input UserSearchInput {
    searchField: UserSearchFields!
    value: String!
  }

  input UserDraft {
    username: String!
    oosId: String
    patrolScouterId: String
    admin: Boolean
    password: String
    workflowState: WorkflowState
  }

  input UserUpdateInput {
    username: String!
    oosId: String
    admin: String
    workflowState: WorkflowState
  }
`;
