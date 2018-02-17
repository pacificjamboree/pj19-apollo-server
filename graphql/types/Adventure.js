const { connectionArgs } = require('graphql-relay-tools');
const gql = require('../../lib/gql');
module.exports = gql`
  type Adventure implements Node {
    id: ID!
    _id: ID!
    adventureCode: String!
    name: String!
    themeName: String!
    description: String
    location: AdventureLocation
    capacityPerPeriod: Int!
    periodsOffered: Int!
    periodsRequired: Int!
    premiumAdventure: Boolean!
    fee: Float!
    hidden: Boolean!
    OffersOfServiceConnection${connectionArgs()}: OffersOfServiceConnection
    ManagersConnection${connectionArgs()}: OffersOfServiceConnection
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
    workflowState: WorkflowState
  }
`;
