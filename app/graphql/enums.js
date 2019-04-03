const gql = require('./gql');
module.exports = gql`
  enum WorkflowState {
    defined
    active
    deleted
  }

  enum AdventureLocation {
    onsite
    offsite
  }

  enum OfferOfServiceSearchFields {
    id
    _id
    oosNumber
  }

  enum OfferOfServiceForAdventureSearchFields {
    id
    _id
  }

  enum AdventureSearchFields {
    id
    _id
    adventureCode
  }

  enum PatrolSearchFields {
    id
    _id
    patrolNumber
  }

  enum PatrolScouterSearchFields {
    id
    _id
  }

  enum UserSearchFields {
    id
    _id
    username
  }

  enum UserRoles {
    user
    patrolScouter
    offerOfService
    adventureManager
    admin
  }

  enum Subcamp {
    S
    O
    V
  }

  enum PatrolAdventureSelectionSearchFields {
    id
    _id
    patrolId
    patrolNumber
  }

  enum PatrolAdventureSelectionWorkflowState {
    defined
    draft
    saved
    locked
  }

  enum TextContentSearchFields {
    id
    _id
    title
  }
`;
