const gql = require('../../lib/gql');
module.exports = gql`
  type OffersOfServiceConnection {
    pageInfo: PageInfo
    edges: [OffersOfServiceEdge]
  }

  type OffersOfServiceEdge {
    node: OfferOfService!
    cursor: ID!
  }
`;
