const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { createAdventure } = require('../resolvers/adventure');
module.exports = mutationWithClientMutationId({
  name: 'createAdventure',
  inputFields: `
    Adventure: AdventureDraft
  `,
  outputFields: `
    Adventure: Adventure
  `,
  mutateAndGetPayload: async input => await createAdventure(input),
});
