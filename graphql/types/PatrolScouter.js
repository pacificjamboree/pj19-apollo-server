const gql = require('../../lib/gql');
module.exports = gql`
  type PatrolScouter implements Node {
    id: ID!
    _id: ID!
    Patrol: Patrol!
    firstName: String!
    lastName: String!
    fullName: String!
    email: String!
    workflowState: WorkflowState!
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;
