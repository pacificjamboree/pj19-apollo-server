const gql = require('../gql');
module.exports = gql`
  type PatrolScoutersConnection {
    pageInfo: PageInfo
    edges: [PatrolScoutersEdge]
  }

  type PatrolScoutersEdge {
    node: PatrolScouter!
    cursor: ID!
  }
`;
