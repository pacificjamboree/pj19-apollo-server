const gql = require('graphql-tag');
const types = gql`
  scalar GraphQLDate

  scalar GraphQLDateTime

  enum AdventureLocation {
    ONSITE
    OFFSITE
  }

  type Query {
    allOffersOfService: [OOS]
    offerOfService(oosNumber: String!): OOS
    allAdventures: [Adventure]
    adventure(adventureCode: String!): Adventure
  }

  type Mutation {
    createOfferOfService(input: CreateOOSInput!): CreateOOSPayload
  }

  input CreateOOSInput {
    oosNumber: String!
    firstName: String!
    lastName: String!
    preferredName: String
    birthdate: GraphQLDate!
    email: String
    phone1: String
    phone2: String
    prerecruited: Boolean
    prerecruitedBy: String
    additionalInformation: String
    previousExperience: String
    specialSkills: String
    registrationStatus: String
  }

  type CreateOOSPayload {
    OfferOfService: OOS
  }

  type OOS {
    id: ID!
    oosNumber: String!
    assigned: Boolean!
    assignment: Adventure
    firstName: String!
    lastName: String!
    preferredName: String
    fullName: String!
    birthdate: GraphQLDate!
    isYouth: Boolean!
    email: String
    phone1: String
    phone2: String
    prerecruited: Boolean!
    prerecruitedBy: String
    additionalInformation: String
    previousExperience: String
    specialSkills: String
    registrationStatus: String
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }

  type Adventure {
    id: ID!
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
    OffersOfService: [OOS]!
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;

module.exports = types;
