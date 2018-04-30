const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { createPatrol } = require('../resolvers/patrol');
module.exports = mutationWithClientMutationId({
  name: 'createPatrol',
  inputFields: `
    Patrol: PatrolDraft!
  `,
  outputFields: `
    Patrol: Patrol
  `,
  mutateAndGetPayload: async input => await createPatrol(input),
});
