const gql = require('../gql');
module.exports = gql`
  type PatrolScouter implements Node {
    id: ID!
    _id: ID!
    Patrols: [Patrol!]
    email: String!
    user: User
    workflowState: WorkflowState!
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;
