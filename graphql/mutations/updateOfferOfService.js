const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { updateOfferOfService } = require('../knex_connector');

module.exports = mutationWithClientMutationId({
  name: 'updateOfferOfService',
  inputFields: `
    id: ID!
    OfferOfService: OfferOfServiceInput!
  `,
  outputFields: `
    OfferOfService: OfferOfService
  `,
  mutateAndGetPayload: async input => await updateOfferOfService(input),
});
