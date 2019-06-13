const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { addAdventurePeriodToPatrol } = require('../resolvers/patrol');

module.exports = mutationWithClientMutationId({
  name: 'addAdventurePeriodToPatrolSchedule',
  inputFields: `
    patrolId: ID!
    adventurePeriodId: ID!
  `,
  outputFields: `
    patrol: Patrol
  `,
  mutateAndGetPayload: async input => await addAdventurePeriodToPatrol(input),
});
