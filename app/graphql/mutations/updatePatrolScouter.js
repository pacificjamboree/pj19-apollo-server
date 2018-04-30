const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { updatePatrolScouter } = require('../resolvers/patrolScouter');

module.exports = mutationWithClientMutationId({
  name: 'updatePatrolScouter',
  inputFields: `
    id: ID!
    PatrolScouter: PatrolScouterUpdate!
  `,
  outputFields: `
    PatrolScouter: PatrolScouter
  `,
  mutateAndGetPayload: async input => await updatePatrolScouter(input),
});
