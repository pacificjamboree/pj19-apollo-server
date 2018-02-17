const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { assignManagerToAdventure } = require('../knex_connector');

module.exports = mutationWithClientMutationId({
  name: 'assignManagerToAdventure',
  inputFields: `
    adventureId: ID!
    oosId: ID!
  `,
  outputFields: `
    OfferOfService: OfferOfService
    Adventure: Adventure
  `,
  mutateAndGetPayload: async input => await assignManagerToAdventure(input),
});
