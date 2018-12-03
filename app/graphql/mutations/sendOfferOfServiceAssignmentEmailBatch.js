const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { getOfferOfService } = require('../resolvers/offerOfService');
const { sendOOSAssignmentMessage } = require('../../lib/mail');

module.exports = mutationWithClientMutationId({
  name: 'sendOfferOfServiceAssignmentEmailBatch',
  inputFields: `
    ids: [ID!]!
  `,
  outputFields: `
    status: String
  `,
  mutateAndGetPayload: async ({ ids }) => {
    for (let i = 0; i < ids.length; i++) {
      const oos = await getOfferOfService({ searchField: 'id', value: ids[i] });
      if (oos.assignedAdventureId) {
        await sendOOSAssignmentMessage(oos);
      }
    }
    return {
      status: 'ok',
    };
  },
});
