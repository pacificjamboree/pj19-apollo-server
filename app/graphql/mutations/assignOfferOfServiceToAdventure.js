const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { changeAssignment } = require('../resolvers/offerOfService');
module.exports = mutationWithClientMutationId({
  name: 'assignOfferOfServiceToAdventure',
  inputFields: `
    oosId: ID!,
    adventureId: ID # ID is nullable to allow removing an assignment
  `,
  outputFields: `
    OfferOfService: OfferOfService
  `,
  mutateAndGetPayload: async input => await changeAssignment(input),
});
