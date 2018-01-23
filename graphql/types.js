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
    offerOfService(oos_number: String!): OOS
    allAdventures: [Adventure]
    adventure(adventure_code: String!): Adventure
  }

  type OOS {
    id: ID!
    oos_number: String!
    assigned: Boolean!
    assignment: Adventure
    first_name: String!
    last_name: String!
    preferred_name: String
    birthdate: GraphQLDate!
    is_youth: Boolean!
    email: String
    phone1: String
    phone2: String
    prerecruited: Boolean!
    prerecruited_by: String
    additional_information: String
    previous_experience: String
    special_skills: String
    registration_status: String
    created_at: GraphQLDateTime!
  }

  type Adventure {
    id: ID!
    adventure_code: String!
    name: String!
    theme_name: String!
    description: String
    location: AdventureLocation
    capacity_per_period: Int!
    periods_offered: Int!
    periods_required: Int!
    premium_adventure: Boolean!
    fee: Float!
    hidden: Boolean!
    created_at: GraphQLDateTime!
    updated_at: GraphQLDateTime!
  }
`;

module.exports = types;
