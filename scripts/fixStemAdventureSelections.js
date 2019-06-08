const { transaction } = require('objection');
const { Adventure, PatrolAdventureSelection } = require('../app/models');

const main = async () => {
  try {
    const knex = PatrolAdventureSelection.knex();
    let result;
    await transaction(knex, async t => {
      const oceanwise = await Adventure.query(t)
        .where('adventureCode', 'stem_oceanwise')
        .select('id')
        .first();
      const shoreline = await Adventure.query(t)
        .where('adventureCode', 'stem_shoreline')
        .select('id')
        .first();

      const oldId = await Adventure.query(t)
        .where({ adventureCode: 'stem' })
        .first()
        .select('id');

      const selections = await PatrolAdventureSelection.query(t).whereNot({
        workflowState: 'deleted',
      });
      const promises = selections.map(selection => {
        const idx = selection.selectionOrder.indexOf(oldId.id);
        const newOrder = selection.selectionOrder.slice();
        newOrder[idx] = oceanwise.id;
        newOrder.push(shoreline.id);
        return selection
          .$query(t)
          .patch({ selectionOrder: JSON.stringify(newOrder) })
          .where({ id: selection.id })
          .returning('*');
      });
      result = await Promise.all(promises);
    });
    console.log(result);
  } catch (error) {
    throw error;
  }
};

const run = async () => {
  try {
    await main();
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
