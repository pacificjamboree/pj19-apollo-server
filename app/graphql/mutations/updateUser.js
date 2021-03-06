const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { updateUser } = require('../resolvers/user');
module.exports = mutationWithClientMutationId({
  name: 'updateUser',
  inputFields: `
    id: ID!
    User: UserUpdate!
  `,
  outputFields: `
    User: User
  `,
  mutateAndGetPayload: async input => await updateUser(input),
});
