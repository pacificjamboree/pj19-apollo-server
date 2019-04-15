const gql = require('../gql');
module.exports = gql`
  type PatrolAdventureSelectionStats {
    defined: Int
    draft: Int
    saved: Int
    total: Int
  }
`;
