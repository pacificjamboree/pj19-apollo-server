const gql = require('../gql');
module.exports = gql`
  type TextContent implements Node {
    id: ID!
    _id: ID!
    title: String!
    body: String!
    toc: String
    revisions: [TextContent]
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;
