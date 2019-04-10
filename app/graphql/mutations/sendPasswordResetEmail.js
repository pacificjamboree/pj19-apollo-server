const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { generatePasswordResetToken } = require('../../lib/auth');
const sendPasswordResetMessage = require('../../lib/mail/sendPasswordResetMessage');

const { User } = require('../../models');

const sendPasswordResetEmail = mutationWithClientMutationId({
  name: 'sendPasswordResetEmail',
  inputFields: `
    username: String!
  `,
  outputFields: `
    status: String
    error: String
  `,
  mutateAndGetPayload: async ({ username }) => {
    try {
      const user = await User.query()
        .whereRaw('LOWER(username) = ?', username.toLowerCase())
        .first();

      // we return an 'ok' status even when no user
      // matches the input to avoid leaking valid/invalid usernames
      if (!user)
        return {
          status: 'ok',
        };

      if (!['active', 'defined'].includes(user.workflowState)) {
        return {
          status: 'error',
          error: 'Can not reset password for this user',
        };
      }

      const token = await generatePasswordResetToken(user);
      await sendPasswordResetMessage({ user, token });
      return {
        status: 'ok',
      };
    } catch (e) {
      throw e;
    }
  },
});

module.exports = sendPasswordResetEmail;
