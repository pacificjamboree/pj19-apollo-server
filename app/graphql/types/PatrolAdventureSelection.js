const gql = require('../gql');
module.exports = gql`
  type PatrolAdventureSelection implements Node {
    id: ID!
    _id: ID!
    patrolId: String!
    wantScuba: Boolean!
    wantExtraFreePeriod: Boolean!
    selectionOrder: [Adventure]!
    workflowState: PatrolAdventureSelectionWorkflowState
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
  }
`;
