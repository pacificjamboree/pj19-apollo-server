const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { createAdventure } = require('../resolvers/adventure');
module.exports = mutationWithClientMutationId({
  name: 'createAdventure',
  inputFields: `
    adventureCode: String!
    name: String!
    themeName: String!
    description: String
    location: AdventureLocation!
    capacityPerPeriod: Int!
    periodsOffered: Int!
    periodsRequired: Int!
    premiumAdventure: Boolean = false
    fee: Float = 0.00
  `,
  outputFields: `
    Adventure: Adventure
  `,
  mutateAndGetPayload: async input => await createAdventure(input),
});
