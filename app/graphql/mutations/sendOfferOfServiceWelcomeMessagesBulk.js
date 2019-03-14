const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { OfferOfService } = require('../../models');
const { fromGlobalId } = require('graphql-relay-tools');

const {
  sendOOSWelcomeMessage,
  sendOOSAssignmentMessage,
} = require('../../lib/mail');

module.exports = mutationWithClientMutationId({
  name: 'sendOfferOfServiceWelcomeMessagesBulk',
  inputFields: `
    ids: [ID!]!
  `,
  outputFields: `
    status: String
  `,
  mutateAndGetPayload: async ({ ids }) => {
    const _ids = ids.map(i => fromGlobalId(i).id);
    const oos = await OfferOfService.query()
      .whereIn('id', _ids)
      .eager('assignment.[offersOfService]');

    for (let i = 0; i < oos.length; i++) {
      if (oos[i].assignedAdventureId) {
        sendOOSAssignmentMessage(oos[i]);
      } else {
        sendOOSWelcomeMessage(oos[i]);
      }
    }
    return {
      status: 'ok',
    };
  },
});
