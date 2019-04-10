const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { getPatrol } = require('../resolvers/patrol');
const {
  queues: { SEND_EMAIL },
} = require('../../queues');

module.exports = mutationWithClientMutationId({
  name: 'sendPatrolWelcomeMessage',
  inputFields: `
    patrolNumber: String!
  `,
  outputFields: `
    status: String
    error: String
  `,
  mutateAndGetPayload: async ({ patrolNumber }) => {
    try {
      const patrol = await getPatrol({
        searchField: 'patrolNumber',
        value: patrolNumber,
      });
      if (!patrol) {
        return {
          error: 'Patrol not found',
        };
      }

      SEND_EMAIL.add({
        type: 'PATROL_WELCOME',
        data: { to: patrol.patrolScouter.email },
      });

      return { status: 'ok' };
    } catch (error) {
      throw error;
    }
  },
});
