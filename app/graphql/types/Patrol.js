const { connectionArgs } = require('graphql-relay-tools');
const gql = require('../gql');
module.exports = gql`
  type Patrol implements Node {
    id: ID!
    _id: ID!
    patrolNumber: String!
    name: String!
    numberOfScouts: Int!
    numberOfScouters: Int!
    totalUnitSize: Int!
    fullyPaid: Boolean!
    finalPaymentReceived: GraphQLDate
    PatrolScoutersConnection${connectionArgs()}: PatrolScoutersConnection
    workflowState: WorkflowState!
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;
