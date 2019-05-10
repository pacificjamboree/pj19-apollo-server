const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { authenticateUser, generateJWTForUser } = require('../../lib/auth');
const { EINVALIDCREDENTIALS } = require('../../lib/errors');
const { User } = require('../../models');

const getUser = username =>
  User.query()
    .whereRaw('LOWER(username) = ?', username.toLowerCase())
    .first();

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
      const isMasqueradeLogin = username.includes(':');
      if (isMasqueradeLogin) {
        const [subject, superuser] = username.split(':');
        const user = await authenticateUser(superuser, password);
        user.roles = await user.calculateRoles();
        if (!user.roles.includes('admin')) {
          throw new EINVALIDCREDENTIALS();
        }
        const subjectUser = await getUser(subject);
        if (!subjectUser) throw new EINVALIDCREDENTIALS();
        const token = await generateJWTForUser(subjectUser);
        return {
          token,
          viewer: subjectUser,
        };
      } else {
        const user = await authenticateUser(username, password);
        user.roles = await user.calculateRoles();
        const token = await generateJWTForUser(user);
        return {
          token,
          viewer: user,
        };
      }
    } catch (e) {
      throw e;
    }
  },
});
