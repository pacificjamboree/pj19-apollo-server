const gql = require('../gql');
module.exports = gql`
  type OffersOfServiceConnection {
    pageInfo: PageInfo
    edges: [OffersOfServiceEdge]
  }

  type OffersOfServiceEdge {
    node: OfferOfServiceNode!
    cursor: ID!
  }
`;
