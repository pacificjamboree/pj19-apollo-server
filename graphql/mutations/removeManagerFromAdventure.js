const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { removeManagerFromAdventure } = require('../knex_connector');

module.exports = mutationWithClientMutationId({
  name: 'removeManagerFromAdventure',
  inputFields: `
    oosId: ID!
    adventureId: ID!
  `,
  outputFields: `
    Adventure: Adventure
  `,
  mutateAndGetPayload: async input => await removeManagerFromAdventure(input),
});
