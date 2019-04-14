const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { getOfferOfService } = require('../resolvers/offerOfService');
const { sendOOSOverdueMessage } = require('../../lib/mail');

module.exports = mutationWithClientMutationId({
  name: 'sendOfferOfServiceOverdueEmail',
  inputFields: `
    id: ID!
  `,
  outputFields: `
    status: String
  `,
  mutateAndGetPayload: async input => {
    const oos = await getOfferOfService({ searchField: 'id', value: input.id });
    await sendOOSOverdueMessage(oos);
    return {
      status: 'ok',
    };
  },
});
