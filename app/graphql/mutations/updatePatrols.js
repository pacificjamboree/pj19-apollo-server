const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { updatePatrols } = require('../resolvers/patrol');
module.exports = mutationWithClientMutationId({
  name: 'updatePatrols',
  inputFields: `
    Patrols: [PatrolUpdate]
    `,
  outputFields: `
    Patrols: [Patrol]
  `,
  mutateAndGetPayload: async input => await updatePatrols(input),
});
