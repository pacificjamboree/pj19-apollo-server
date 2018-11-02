const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { batchImportOffersOfService } = require('../resolvers/offerOfService');

module.exports = mutationWithClientMutationId({
  name: 'batchImportOffersOfService',
  inputFields: `
    OffersOfService: [OfferOfServiceDraft!]!
  `,
  outputFields: `
    offersOfService: [OfferOfService]
  `,
  mutateAndGetPayload: async input => await batchImportOffersOfService(input),
});
