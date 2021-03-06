const { mutationWithClientMutationId } = require('graphql-relay-tools');
const {
  updatePatrolAdventureSelection,
} = require('../resolvers/patrolAdventureSelection');

module.exports = mutationWithClientMutationId({
  name: 'updatePatrolAdventureSelection',
  inputFields: `
    id: ID!
    PatrolAdventureSelection: PatrolAdventureSelectionUpdate
  `,
  outputFields: `
    PatrolAdventureSelection: PatrolAdventureSelection
  `,
  mutateAndGetPayload: async (input, ctx, info) =>
    await updatePatrolAdventureSelection(input, ctx, info),
});
