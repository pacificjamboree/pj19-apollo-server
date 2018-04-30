const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { updateOfferOfService } = require('../resolvers/offerOfService');

module.exports = mutationWithClientMutationId({
  name: 'updateOfferOfService',
  inputFields: `
    id: ID!
    OfferOfService: OfferOfServiceUpdate!
  `,
  outputFields: `
    OfferOfService: OfferOfService
  `,
  mutateAndGetPayload: async input => await updateOfferOfService(input),
});
