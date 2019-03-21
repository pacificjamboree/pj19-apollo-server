const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { createUsers } = require('../resolvers/user');
module.exports = mutationWithClientMutationId({
  name: 'createUsers',
  inputFields: `
    Users: [UserDraft!]!
  `,
  outputFields: `
    users: [User]
  `,
  mutateAndGetPayload: async input => await createUsers(input),
});
