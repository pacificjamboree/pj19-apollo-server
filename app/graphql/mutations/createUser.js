const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { createUser } = require('../resolvers/user');
module.exports = mutationWithClientMutationId({
  name: 'createUser',
  inputFields: `
    username: String!
    password: String
    oosId: String,
    patrolScouterId: String,
    admin: Boolean
    workflowState: WorkflowState!
  `,
  outputFields: `
    User: User
  `,
  mutateAndGetPayload: async input => await createUser(input),
});
