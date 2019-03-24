const gql = require('../gql');
module.exports = gql`
  type PatrolScouter implements Node {
    id: ID!
    _id: ID!
    Patrols: [Patrol!]
    firstName: String!
    lastName: String!
    fullName: String!
    email: String!
    phone: String!
    user: User
    workflowState: WorkflowState!
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;
