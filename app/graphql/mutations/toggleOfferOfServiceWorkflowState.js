const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { toggleWorkflowState } = require('../resolvers/offerOfService');

module.exports = mutationWithClientMutationId({
  name: 'toggleOfferOfServiceWorkflowState',
  inputFields: `
    id: ID!
    workflowState: WorkflowState!
  `,
  outputFields: `
    OfferOfService: OfferOfService
  `,
  mutateAndGetPayload: async input => await toggleWorkflowState(input),
});
