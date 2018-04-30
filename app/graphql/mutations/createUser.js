const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { createUser } = require('../resolvers/user');
module.exports = mutationWithClientMutationId({
  name: 'createUser',
  inputFields: `
    User: UserDraft
  `,
  outputFields: `
    User: User
  `,
  mutateAndGetPayload: async input => await createUser(input),
});
