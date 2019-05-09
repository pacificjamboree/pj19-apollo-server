const gql = require('../gql');
module.exports = gql`
  type SelectionRanking {
    adventure: Adventure
    rankings: [Int]
    score: Int
  }

  type PatrolAdventureSelectionStats {
    defined: Int
    draft: Int
    saved: Int
    total: Int
    wantExtraFreePeriod: Int
    selectionRankings: [SelectionRanking]
  }
`;
