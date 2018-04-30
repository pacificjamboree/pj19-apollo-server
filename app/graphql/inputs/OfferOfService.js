const gql = require('../gql');
module.exports = gql`
  input OfferOfServiceSearchInput {
    searchField: OfferOfServiceSearchFields!
    value: String!
  }

  input OfferOfServiceInput {
    firstName: String
    lastName: String
    preferredName: String
    birthdate: GraphQLDate
    email: String
    phone1: String
    phone2: String
    prerecruited: Boolean
    prerecruitedBy: String
    additionalInformation: String
    previousExperience: String
    specialSkills: String
    registrationStatus: String
  }

  input OfferOfServiceFilters {
    workflowState: [WorkflowState]
    assigned: Boolean
    email: String
    name: String
  }
`;
