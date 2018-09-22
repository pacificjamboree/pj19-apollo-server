const gql = require('../gql');
module.exports = gql`
  input OfferOfServiceSearchInput {
    searchField: OfferOfServiceSearchFields!
    value: String!
  }

  input OfferOfServiceDraft {
    oosNumber: String!
    firstName: String!
    lastName: String!
    preferredName: String
    birthdate: GraphQLDate!
    email: String
    phone1: String
    phone2: String
    prerecruited: Boolean
    prerecruitedBy: String
    additionalInformation: String
    previousExperience: String
    specialSkills: String
    registrationStatus: String
    workflowState: WorkflowState
  }

  input OfferOfServiceUpdate {
    oosNumber: String!
    firstName: String!
    lastName: String!
    preferredName: String
    birthdate: GraphQLDate!
    email: String!
    parentEmail: String
    phone1: String!
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
  }
`;
