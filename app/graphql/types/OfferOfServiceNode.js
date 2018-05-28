const gql = require('../gql');
module.exports = gql`
  type OfferOfServiceNode implements Node {
    id: ID!
    _id: ID!
    oosNumber: String!
    firstName: String!
    lastName: String!
    preferredName: String
    fullName: String!
    birthdate: GraphQLDate!
    isYouth: Boolean!
    email: String
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
  }
`;
