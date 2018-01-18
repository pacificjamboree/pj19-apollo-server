const types = `
  type Query { 
    allOffersOfService: [OOS],
    offerOfService(oos_number: String!): OOS
  }

  type OOS { 
    oos_number: String!,
    first_name: String!,
    last_name: String!,
    preferred_name: String
   }
`;

module.exports = types;
