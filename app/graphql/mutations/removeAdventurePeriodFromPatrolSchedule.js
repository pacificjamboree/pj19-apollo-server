const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { removeAdventurePeriodFromPatrol } = require('../resolvers/patrol');

module.exports = mutationWithClientMutationId({
  name: 'removeAdventurePeriodFromPatrolSchedule',
  inputFields: `
    patrolId: ID!
    adventurePeriodId: ID!
  `,
  outputFields: `
    patrol: Patrol
  `,
  mutateAndGetPayload: async input =>
    await removeAdventurePeriodFromPatrol(input),
});
