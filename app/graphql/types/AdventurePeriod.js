const gql = require('../gql');
module.exports = gql`
  type AdventurePeriod {
    id: ID!
    _id: ID!
    adventureId: ID!
    # adventure: Adventure!
    startAt: GraphQLDateTime!
    endAt: GraphQLDateTime!
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;
