const gql = require('../../lib/gql');
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
