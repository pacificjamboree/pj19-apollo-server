const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { resetPasswordForUser } = require('../resolvers/user');

module.exports = mutationWithClientMutationId({
  name: 'resetPassword',
  inputFields: `
    passwordResetToken: String!
    password: String!
  `,
  outputFields: `
    status: String
  `,
  mutateAndGetPayload: async input => await resetPasswordForUser(input),
});
