const gql = require('./gql');
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

  input AdventureSearchInput {
    searchField: AdventureSearchFields!
    value: String!
  }

  input OfferOfServiceFilters {
    workflowState: [WorkflowState]
    assigned: Boolean
    email: String
    name: String
  }

  input AdventureFilters {
    workflowState: [WorkflowState]
    location: [AdventureLocation]
    name: String
    themeName: String
    premiumAdventure: Boolean
  }

  input PatrolFilters {
    workflowState: [WorkflowState]
    name: String
    fullyPaid: Boolean
  }

  input PatrolSearchInput {
    searchField: PatrolSearchFields!
    value: String!
  }

  input PatrolScouterSearchInput {
    searchField: PatrolScouterSearchFields!
    value: String!
  }

  input PatrolScouterFilters {
    workflowState: [WorkflowState]
    name: String
    patrolNumber: String
  }

  input UserSearchInput {
    searchField: UserSearchFields!
    value: String!
  }

  input UserUpdateInput {
    username: String!
    oosId: String
    admin: String
    workflowState: WorkflowState
  }
`;
