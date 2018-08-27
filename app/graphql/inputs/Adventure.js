const gql = require('../gql');
module.exports = gql`
  input AdventureDraft {
    adventureCode: String!
    name: String!
    themeName: String!
    description: String
    location: AdventureLocation!
    capacityPerPeriod: Int!
    periodsOffered: Int!
    periodsRequired: Int!
    premiumAdventure: Boolean = false
    fee: Float = 0.00
  }

  input AdventureUpdate {
    adventureCode: String
    name: String
    themeName: String
    description: String
    location: AdventureLocation
    capacityPerPeriod: Int
    periodsOffered: Int
    periodsRequired: Int
    premiumAdventure: Boolean = false
    fee: Float
    hidden: Boolean = false
    pdrPlan: [String]
    pdrDo: [String]
    pdrReview: [String]
    pdrSafetyTips: [String]
  }

  input AdventureSearchInput {
    searchField: AdventureSearchFields!
    value: String!
  }

  input AdventureFilters {
    workflowState: [WorkflowState]
    location: [AdventureLocation]
    name: String
    themeName: String
    premiumAdventure: Boolean
  }

`;
