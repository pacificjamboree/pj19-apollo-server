const gql = require('../gql');
module.exports = gql`
  type AdventurePeriod {
    id: ID!
    _id: ID!
    adventureId: ID!
    adventure: Adventure
    patrolsAssignedCount: Int
    participantsAssigned: AdventurePeriodAssignedCount
    patrols: [Patrol]
    startAt: GraphQLDateTime!
    endAt: GraphQLDateTime!
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;
