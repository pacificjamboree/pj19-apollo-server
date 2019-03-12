const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { updateTextContent } = require('../resolvers/textContent');
const {
  queues: { ADVENTURE_GUIDE_PDF },
} = require('../../queues');

module.exports = mutationWithClientMutationId({
  name: 'updateAdventureGuide',
  inputFields: `
    title: String!
    TextContent: TextContentUpdate!
  `,
  outputFields: `
    TextContent: TextContent
  `,
  mutateAndGetPayload: async input => {
    try {
      const ret = await updateTextContent(input);
      ADVENTURE_GUIDE_PDF.add();
      return ret;
    } catch (error) {
      throw error;
    }
  },
});
