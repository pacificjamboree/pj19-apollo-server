const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { createOfferOfService } = require('../resolvers/offerOfService');
module.exports = mutationWithClientMutationId({
  name: 'createOfferOfService',
  inputFields: `
    OfferOfService: OfferOfServiceDraft!
  `,
  outputFields: `
    OfferOfService: OfferOfService
  `,
  mutateAndGetPayload: async input => await createOfferOfService(input),
});
