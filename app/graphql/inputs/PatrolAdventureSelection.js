const gql = require('../gql');
module.exports = gql`
  input PatrolAdventureSelectionSearchInput {
    searchField: PatrolAdventureSelectionSearchFields
    value: String!
  }
`;
