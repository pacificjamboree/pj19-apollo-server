const gql = require('../gql');
module.exports = gql`
  type AdventurePeriod {
    id: ID!
    _id: ID!
    adventureId: ID!
    adventure: Adventure
    patrolsAssignedCount: Int
    participantsAssigned: AdventurePeriodAssignedCount
    capacityRemaining: Int
    patrols: [Patrol]
    type: String
    capacityOverride: Int
    assignWith: [AdventurePeriod]
    childPeriods: [AdventurePeriod]
    startAt: GraphQLDateTime!
    endAt: GraphQLDateTime!
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;
