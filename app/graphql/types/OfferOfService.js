const gql = require('../gql');
module.exports = gql`
  type OfferOfService implements Node {
    id: ID!
    _id: ID!
    oosNumber: String!
    assigned: Boolean!
    assignment: Adventure
    firstName: String!
    lastName: String!
    preferredName: String
    fullName: String!
    isYouth: Boolean!
    email: String
    parentEmail: String
    phone1: String
    phone2: String
    prerecruited: Boolean!
    prerecruitedBy: String
    additionalInformation: String
    previousExperience: String
    specialSkills: String
    registrationStatus: String
    createdAt: GraphQLDateTime!
    updatedAt: GraphQLDateTime!
    workflowState: WorkflowState
    importId: String
    isAdventureManager: Boolean
    user: User
    welcomeEmailSentAt: GraphQLDateTime
    assignmentEmailSentAt: GraphQLDateTime
  }
`;
