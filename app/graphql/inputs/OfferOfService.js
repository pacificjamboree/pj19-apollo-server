const gql = require('../gql');
module.exports = gql`
  input OfferOfServiceSearchInput {
    searchField: OfferOfServiceSearchFields!
    value: String!
  }

  input OfferOfServiceForAdventureSearchInput {
    searchField: OfferOfServiceForAdventureSearchFields!
    value: String!
  }

  input OfferOfServiceDraft {
    oosNumber: String!
    firstName: String!
    lastName: String!
    preferredName: String
    isYouth: Boolean!
    email: String!
    parentEmail: String
    phone1: String
    phone2: String
    prerecruited: Boolean
    prerecruitedBy: String
    additionalInformation: String
    previousExperience: String
    specialSkills: String
    registrationStatus: String
    assignedAdventureId: ID
    workflowState: WorkflowState
    importId: String
  }

  input OfferOfServiceUpdate {
    oosNumber: String!
    firstName: String!
    lastName: String!
    preferredName: String
    isYouth: Boolean!
    email: String!
    parentEmail: String
    phone1: String
    phone2: String
    prerecruited: Boolean
    prerecruitedBy: String
    additionalInformation: String
    previousExperience: String
    specialSkills: String
    assignedAdventureId: ID
    workflowState: WorkflowState
  }

  input OfferOfServiceFilters {
    workflowState: [WorkflowState]
    assigned: Boolean
    email: String
    name: String
    importId: String
  }
`;
