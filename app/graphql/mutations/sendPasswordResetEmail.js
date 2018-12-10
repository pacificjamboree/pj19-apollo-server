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
        .where({ username })
        .first();

      if (!user)
        return {
          status: 'error',
          error: 'No user found',
        };

      if (!['active', 'pending'].includes(user.workflowState)) {
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
