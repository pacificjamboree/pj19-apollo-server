const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { createPatrol } = require('../resolvers/patrol');
module.exports = mutationWithClientMutationId({
  name: 'createPatrol',
  inputFields: `
    patrolNumber: String!
    name: String!
    numberOfScouts: Int!
    numberOfScouters: Int!
    fullyPaid: Boolean
    workflowState: WorkflowState
  `,
  outputFields: `
    Patrol: Patrol
  `,
  mutateAndGetPayload: async input => await createPatrol(input),
});
