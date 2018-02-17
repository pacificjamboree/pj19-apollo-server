const { mutationWithClientMutationId } = require('graphql-relay-tools');
const { toggleOfferOfServiceWorkflowState } = require('../knex_connector');

module.exports = mutationWithClientMutationId({
  name: 'toggleOfferOfServiceWorkflowState',
  inputFields: `
    id: ID!
    workflowState: WorkflowState!
  `,
  outputFields: `
    OfferOfService: OfferOfService
  `,
  mutateAndGetPayload: async input =>
    await toggleOfferOfServiceWorkflowState(input),
});
