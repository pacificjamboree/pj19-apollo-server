const gql = require('../gql');
module.exports = gql`
  type OfferOfServiceCount {
    required: Int!
    adultRequired: Int!
    allocated: Int!
    adultAllocated: Int!
    assigned: Int!
    unassigned: Int!
  }
`;
