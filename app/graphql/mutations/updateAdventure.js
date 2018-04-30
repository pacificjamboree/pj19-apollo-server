const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { updateAdventure } = require('../resolvers/adventure');
module.exports = mutationWithClientMutationId({
  name: 'updateAdventure',
  inputFields: `
    id: ID!
    Adventure: AdventureUpdate
  `,
  outputFields: `
    Adventure: Adventure
  `,
  mutateAndGetPayload: async input => updateAdventure(input),
});
