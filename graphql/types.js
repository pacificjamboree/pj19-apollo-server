const types = `
  scalar GraphQLDate
  scalar GraphQLDateTime

  type Query { 
    allOffersOfService: [OOS],
    offerOfService(oos_number: String!): OOS
  }

  type OOS { 
    id: ID!,
    oos_number: String!,
    assigned: Boolean!,
    first_name: String!,
    last_name: String!,
    preferred_name: String,
    birthdate: GraphQLDate!,
    is_youth: Boolean!,
    email: String,
    phone1: String,
    phone2: String,
    prerecruited: Boolean!,
    prerecruited_by: String,
    additional_information: String,
    previous_experience: String,
    special_skills: String,
    registration_status: String,
    created_at: GraphQLDateTime!,
    updated_at: GraphQLDateTime!
   }
`;

module.exports = types;
