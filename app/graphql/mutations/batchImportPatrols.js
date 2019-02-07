const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { batchImportPatrols } = require('../resolvers/patrol');

module.exports = mutationWithClientMutationId({
  name: 'batchImportPatrols',
  inputFields: `
    Patrols: [PatrolImportDraft!]!
  `,
  outputFields: `
    newPatrols: [Patrol]
  `,
  mutateAndGetPayload: async input => {
    const results = await batchImportPatrols(input);
    console.log({ results });
    return results;
  },
});
