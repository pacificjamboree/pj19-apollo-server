const gql = require('../gql');
module.exports = gql`
  input PatrolAdventureSelectionSearchInput {
    searchField: PatrolAdventureSelectionSearchFields
    value: ID!
  }

  input PatrolAdventureSelectionUpdate {
    wantScuba: Boolean
    wantExtraFreePeriod: Boolean
    selectionOrder: [ID!]
    workflowState: PatrolAdventureSelectionWorkflowState
  }

  input PatrolAdventureSelectionFilters {
    workflowState: [PatrolAdventureSelectionWorkflowState]
  }
`;
