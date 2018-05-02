const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { authenticateUser, generateJWTForUser } = require('../../lib/auth');

module.exports = mutationWithClientMutationId({
  name: 'createLoginToken',
  inputFields: `
    username: String!
    password: String!
  `,
  outputFields: `
    token: String
  `,
  mutateAndGetPayload: async ({ username, password }) => {
    try {
      const user = await authenticateUser(username, password);
      const token = await generateJWTForUser(user);
      return {
        token,
      };
    } catch (e) {
      throw e;
    }
  },
});
