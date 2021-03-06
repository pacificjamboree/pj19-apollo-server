const gql = require('../gql');
module.exports = gql`
  type User implements Node {
    id: ID!
    _id: ID!
    username: String!
    admin: Boolean!
    roles: [String]
    passwordHash: String @adminOnly(throw: false)
    passwordResetToken: String @adminOnly(throw: false)
    OfferOfService: OfferOfService
    PatrolScouter: PatrolScouter
    isAdmin: Boolean
    isOfferOfService: Boolean
    isAdventureManager: Boolean
    isPatrolScouter: Boolean
    workflowState: WorkflowState!
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;
