const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { getOfferOfService } = require('../resolvers/offerOfService');
const { sendOOSWelcomeMessage } = require('../../lib/mail');

module.exports = mutationWithClientMutationId({
  name: 'sendOfferOfServiceWelcomeEmail',
  inputFields: `
    id: ID!
  `,
  outputFields: `
    status: String
  `,
  mutateAndGetPayload: async input => {
    const oos = await getOfferOfService({ searchField: 'id', value: input.id });
    await sendOOSWelcomeMessage(oos);
    return {
      status: 'ok',
    };
  },
});
