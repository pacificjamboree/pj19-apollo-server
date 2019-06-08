const gql = require('../gql');
module.exports = gql`
  type AdventurePeriodAssignedCount {
    scouts: Int
    scouters: Int
    total: Int
  }
`;
