const { Adventure, AdventurePeriod } = require('../../app/models');
const { transaction } = require('objection');
const knex = AdventurePeriod.knex();

const DAYS = [8, 9, 10, 11];

const makePeriodsForAdventure = async (adventure, freePeriods, transaction) => {
  try {
    for (const D of DAYS) {
      const DAY1_AM_START = new Date(2019, 6, D, 8, 30);
      const DAY1_AM_END = new Date(2019, 6, D, 11, 30);
      const DAY1_PM_START = new Date(2019, 6, D, 14, 0);
      const DAY1_PM_END = new Date(2019, 6, D, 17, 0);
      const DAY2_AM_START = new Date(2019, 6, D + 1, 8, 30);
      const DAY2_AM_END = new Date(2019, 6, D + 1, 11, 30);
      const FREE_START = new Date(2019, 6, D + 1, 14, 0);

      // make the second and third periods first so we can get their IDs
      const day1AfternoonPeriod = await AdventurePeriod.query(transaction)
        .insert({
          adventureId: adventure.id,
          startAt: DAY1_PM_START,
          endAt: DAY1_PM_END,
        })
        .returning('*');

      const day2MorningPeriod = await AdventurePeriod.query(transaction)
        .insert({
          adventureId: adventure.id,
          startAt: DAY2_AM_START,
          endAt: DAY2_AM_END,
        })
        .returning('*');

      // find the free period matching FREE_START
      const freePeriod = freePeriods.find(fp => {
        return fp.startAt.getTime() === FREE_START.getTime();
      });
      if (!freePeriod) {
        throw new Error('no matching free period found');
      }

      // day1MorningPeriod
      await AdventurePeriod.query(transaction)
        .insert({
          adventureId: adventure.id,
          startAt: DAY1_AM_START,
          endAt: DAY1_AM_END,
          childPeriods: JSON.stringify([
            day1AfternoonPeriod.id,
            day2MorningPeriod.id,
            freePeriod.id,
          ]),
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
        periodsRequired: 3,
      })
      .whereNotIn('adventure_code', ['stem', 'fencing', 'archery']);
    const freeTime = await Adventure.query()
      .where({ adventureCode: 'free' })
      .select('*')
      .eager('periods')
      .first();

    await transaction(knex, async t => {
      for (let adventure of adventures) {
        await makePeriodsForAdventure(adventure, freeTime.periods, t);
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
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = seeder;
