const { Adventure, AdventurePeriod } = require('../../app/models');
const { transaction } = require('objection');
const knex = AdventurePeriod.knex();

const DAYS = [8, 9, 10, 11, 12];

const makePeriodsForAdventure = async (adventure, transaction) => {
  try {
    for (const D of DAYS) {
      const AM_START = new Date(2019, 6, D, 8, 30);
      const AM_END = new Date(2019, 6, D, 11, 30);
      const PM_START = new Date(2019, 6, D, 14, 0);
      const PM_END = new Date(2019, 6, D, 17, 0);

      // make the afternoon period first so we can get its ID
      const afternoonPeriod = await AdventurePeriod.query(transaction)
        .insert({
          adventureId: adventure.id,
          startAt: PM_START,
          endAt: PM_END,
        })
        .returning('*');
      // make morning period
      await AdventurePeriod.query(transaction)
        .insert({
          adventureId: adventure.id,
          startAt: AM_START,
          endAt: AM_END,
          childPeriods: JSON.stringify([afternoonPeriod.id]),
        })
        .returning('*');
    }
  } catch (error) {
    throw error;
  }
};

const seeder = async () => {
  try {
    const adventures = await Adventure.query()
      .where({
        hidden: false,
        workflowState: 'active',
        periodsRequired: 2,
      })
      .whereNotIn('adventure_code', ['stem', 'fencing', 'archery']);

    await transaction(knex, async t => {
      for (let adventure of adventures) {
        await makePeriodsForAdventure(adventure, t);
      }
    });
  } catch (error) {
    throw error;
  }
};

const main = async () => {
  try {
    await seeder();
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(2);
  }
};

if (require.main === module) {
  main();
}

module.exports = seeder;
