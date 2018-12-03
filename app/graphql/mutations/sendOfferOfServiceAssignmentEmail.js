const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { getOfferOfService } = require('../resolvers/offerOfService');
const { sendOOSAssignmentMessage } = require('../../lib/mail');

module.exports = mutationWithClientMutationId({
  name: 'sendOfferOfServiceAssignmentEmail',
  inputFields: `
    id: ID!
  `,
  outputFields: `
    status: String
  `,
  mutateAndGetPayload: async input => {
    const oos = await getOfferOfService({ searchField: 'id', value: input.id });
    if (!oos.assignedAdventureId) {
      return {
        status: 'Error: not assigned to an Adventure',
      };
    }
    await sendOOSAssignmentMessage(oos);
    return {
      status: 'ok',
    };
  },
});
