const gql = require('../gql');
module.exports = gql`
  type PatrolSchedule {
    hoursScheduled: Int
    periods: [AdventurePeriod]
  }
`;
