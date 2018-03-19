const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { createOfferOfService } = require('../resolvers/offerOfService');
module.exports = mutationWithClientMutationId({
  name: 'createOfferOfService',
  inputFields: `
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
    clientMutationId: String
  `,
  outputFields: `
    OfferOfService: OfferOfService
  `,
  mutateAndGetPayload: async input => await createOfferOfService(input),
});
