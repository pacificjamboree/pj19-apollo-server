const gql = require('../gql');
module.exports = gql`
  type AdventurePeriod {
    id: ID!
    _id: ID!
    adventureId: ID!
    startAt: GraphQLDateTime!
    endAt: GraphQLDateTime!
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;
