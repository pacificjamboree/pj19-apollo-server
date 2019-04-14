const gql = require('../gql');
module.exports = gql`
  type PatrolStats {
    numberOfPatrols: Int
    totalScouts: Int
    totalScouters: Int
    patrolsWithThreeScouters: Int
    totalParticipants: Int
    totalAdventureParticipants: Int
  }
`;
