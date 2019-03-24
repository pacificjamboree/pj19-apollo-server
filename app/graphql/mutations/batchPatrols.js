const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { batchPatrols } = require('../resolvers/patrol');

module.exports = mutationWithClientMutationId({
  name: 'batchPatrols',
  inputFields: `
    ImportPatrols: [PatrolImportDraft]!
    DeletePatrols: [ID]!
    PatchPatrols: [PatrolUpdate]!
    `,
  outputFields: `
    ImportedPatrols: [Patrol]
    DeletedPatrols: [Patrol]
    PatchedPatrols: [Patrol]
  `,
  mutateAndGetPayload: async input => {
    const results = await batchPatrols(input);
    return results;
  },
});
