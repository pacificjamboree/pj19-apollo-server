const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { getOfferOfService } = require('../resolvers/offerOfService');
const { sendOOSWelcomeMessage } = require('../../lib/mail');

module.exports = mutationWithClientMutationId({
  name: 'sendOfferOfServiceWelcomeEmailBatch',
  inputFields: `
    ids: [ID!]!
  `,
  outputFields: `
    status: String
  `,
  mutateAndGetPayload: async ({ ids }) => {
    for (let i = 0; i < ids.length; i++) {
      const oos = await getOfferOfService({ searchField: 'id', value: ids[i] });
      await sendOOSWelcomeMessage(oos);
    }
    return {
      status: 'ok',
    };
  },
});
