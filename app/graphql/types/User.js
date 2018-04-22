const gql = require('../gql');
module.exports = gql`
  type User implements Node {
    id: ID!
    _id: ID!
    username: String!
    admin: Boolean!
    passwordHash: String
    passwordResetToken: String
    OfferOfService: OfferOfService
    PatrolScouter: PatrolScouter
    workflowState: WorkflowState!
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;
