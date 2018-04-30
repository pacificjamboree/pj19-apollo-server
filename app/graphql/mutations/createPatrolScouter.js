const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { createPatrolScouter } = require('../resolvers/patrolScouter');

module.exports = mutationWithClientMutationId({
  name: 'createPatrolScouter',
  inputFields: `
    PatrolScouter: PatrolScouterDraft!
  `,
  outputFields: `
    PatrolScouter: PatrolScouter
  `,
  mutateAndGetPayload: async input => await createPatrolScouter(input),
});
