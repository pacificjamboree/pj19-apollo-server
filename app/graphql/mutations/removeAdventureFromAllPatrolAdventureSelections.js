const { mutationWithClientMutationId } = require('graphql-relay-tools');
const {
  removeAdventureFromAllSelections,
} = require('../resolvers/patrolAdventureSelection');

module.exports = mutationWithClientMutationId({
  name: 'removeAdventureFromAllPatrolAdventureSelections',
  inputFields: `
    id: ID
  `,
  outputFields: `
    result: [PatrolAdventureSelection]
  `,
  mutateAndGetPayload: async input =>
    await removeAdventureFromAllSelections(input),
});
