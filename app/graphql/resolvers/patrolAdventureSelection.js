const { fromGlobalId } = require('graphql-relay-tools/dist/node');
const { transaction } = require('objection');
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

const getPatrolAdventureSelections = async () =>
  PatrolAdventureSelection.query().whereNot({ workflowState: 'deleted' });

const updatePatrolAdventureSelection = async (
  { id, PatrolAdventureSelection: input },
  ctx,
  info
) => {
  try {
    console.log(ctx.user);
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

    if (pas.workflowState === 'saved' && !ctx.user.admin) {
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

const removeAdventureFromAllSelections = async ({ id }) => {
  console.log(`removing ${id}`);
  try {
    const knex = PatrolAdventureSelection.knex();
    let result;
    await transaction(knex, async t => {
      const selections = await PatrolAdventureSelection.query(t);

      const promises = selections.map(selection => {
        const newOrder = selection.selectionOrder.filter(elem => elem !== id);
        return selection
          .$query(t)
          .patch({
            selectionOrder: JSON.stringify(newOrder),
          })
          .where({ id: selection.id })
          .returning('*');
      });
      result = await Promise.all(promises);
    });
    return { result };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPatrolAdventureSelection,
  getPatrolAdventureSelections,
  updatePatrolAdventureSelection,
  removeAdventureFromAllSelections,
};
