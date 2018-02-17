const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { changeOfferOfServiceAssignment } = require('../knex_connector');
module.exports = mutationWithClientMutationId({
  name: 'assignOfferOfServiceToAdventure',
  inputFields: `
    oosId: ID!,
    adventureId: ID # ID is nullable to allow removing an assignment
  `,
  outputFields: `
    OfferOfService: OfferOfService
  `,
  mutateAndGetPayload: async input =>
    await changeOfferOfServiceAssignment(input),
});
