const gql = require('../gql');
module.exports = gql`
  type OfferOfServiceCount {
    total: Int!
    assigned: Int!
    unassigned: Int!
    # adventureManagers: Int!
  }
`;
