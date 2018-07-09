const { connectionArgs } = require('graphql-relay-tools');
const gql = require('../gql');
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
    pdrPlan: [String]
    pdrDo: [String]
    pdrReview: [String]
    pdrSafetyTips: [String]
    OffersOfServiceConnection${connectionArgs()}: OffersOfServiceConnection @managerOnly
    ManagersConnection${connectionArgs()}: OffersOfServiceConnection @managerOnly
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
    workflowState: WorkflowState
  }
`;
