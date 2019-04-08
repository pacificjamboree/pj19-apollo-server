const { fromGlobalId } = require('graphql-relay-tools/dist/node');
const { Patrol, PatrolAdventureSelection } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const {
  queues: { SEND_EMAIL },
} = require('../../queues');

const getPatrolAdventureSelection = async input => {
  const { searchField, value } = input;
  let where = whereSearchField(input);

  if (searchField === 'patrolNumber') {
    const patrol = await Patrol.query()
      .where({ patrolNumber: value })
      .select('id')
      .first();

    if (!patrol) {
      return null;
    }
    where = { patrolId: patrol.id };
  }

  return PatrolAdventureSelection.query()
    .where(where)
    .eager('[patrol]')
    .first();
};

const updatePatrolAdventureSelection = async ({
  id,
  PatrolAdventureSelection: input,
}) => {
  try {
    if (Object.keys(input).includes('selectionOrder')) {
      input.selectionOrder = JSON.stringify(input.selectionOrder);
    }
    const pas = await PatrolAdventureSelection.query()
      .patch(input)
      .where({
        id: fromGlobalId(id).id,
      })
      .returning('*')
      .first();

    if (pas.workflowState === 'saved') {
      SEND_EMAIL.add({
        type: 'ADVENTURE_SELECTION',
        data: {
          id: pas.id,
        },
      });
    }
    return {
      PatrolAdventureSelection: pas,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPatrolAdventureSelection,
  updatePatrolAdventureSelection,
};
