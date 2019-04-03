const gql = require('../gql');
module.exports = gql`
  input PatrolAdventureSelectionSearchInput {
    searchField: PatrolAdventureSelectionSearchFields
    value: String!
  }

  input PatrolAdventureSelectionUpdate {
    wantScuba: Boolean
    wantExtraFreePeriod: Boolean
    selectionOrder: [ID!]
    workflowState: PatrolAdventureSelectionWorkflowState
  }
`;
