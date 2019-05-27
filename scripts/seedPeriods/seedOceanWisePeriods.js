const { Adventure, AdventurePeriod } = require('../../app/models');
const { transaction } = require('objection');
const addMinutes = require('date-fns/add_days');
const knex = AdventurePeriod.knex();

const DAYS = [9, 10];

const main = async () => {
  try {
    await transaction(knex, async t => {
      const adventures = await Adventure.query(t)
        .whereIn('adventureCode', ['stem_oceanwise', 'stem_shoreline'])
        .select('id');
      for (const d of DAYS) {
        const AM_START = new Date(2019, 6, d, 8, 30);
        const PM_START = new Date(2019, 6, d, 14, 0);
        const DURATION = 90;

        for (const adventure of adventures) {
          await AdventurePeriod.query(t).insert([
            {
              startAt: AM_START,
              endAt: addMinutes(AM_START, DURATION),
              adventureId: adventure.id,
            },
          ]);
          await AdventurePeriod.query(t).insert([
            {
              startAt: PM_START,
              endAt: addMinutes(PM_START, DURATION),
              adventureId: adventure.id,
            },
          ]);
        }
      }
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(255);
  }
};

main();
