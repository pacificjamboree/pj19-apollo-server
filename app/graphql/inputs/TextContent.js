const gql = require('../gql');

module.exports = gql`
  input TextContentSearchInput {
    searchField: TextContentSearchFields!
    value: String!
  }

  input TextContentUpdate {
    body: String!
  }
`;
