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
    viewer: User
  `,
  mutateAndGetPayload: async ({ username, password }) => {
    try {
      const user = await authenticateUser(username.toLowerCase(), password);
      const token = await generateJWTForUser(user);
      return {
        token,
        viewer: user,
      };
    } catch (e) {
      throw e;
    }
  },
});
