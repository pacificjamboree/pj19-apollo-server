const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { updatePatrol } = require('../resolvers/patrol');
module.exports = mutationWithClientMutationId({
  name: 'updatePatrol',
  inputFields: `
    id: ID!
    Patrol: PatrolUpdate
    `,
  outputFields: `
    Patrol: Patrol
  `,
  mutateAndGetPayload: async input => await updatePatrol(input),
});
