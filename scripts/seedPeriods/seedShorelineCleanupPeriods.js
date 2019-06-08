const { Adventure, AdventurePeriod } = require('../../app/models');
const { transaction } = require('objection');
const knex = AdventurePeriod.knex();

const DAYS = [9, 10];

const seeder = async () => {
  try {
    await transaction(knex, async t => {
      const shoreline = await Adventure.query(t)
        .where({
          adventureCode: 'stem_shoreline',
        })
        .first();

      for (const d of DAYS) {
        const SLC_AM_START = new Date(2019, 6, d, 8, 30);
        const SLC_AM_END = new Date(2019, 6, d, 11, 30);
        const SLC_PM_START = new Date(2019, 6, d, 14, 0);
        const SLC_PM_END = new Date(2019, 6, d, 17, 0);

        await AdventurePeriod.query(t).insert([
          {
            startAt: SLC_AM_START,
            endAt: SLC_AM_END,
            adventureId: shoreline.id,
            type: 'primary',
          },
        ]);
        await AdventurePeriod.query(t).insert([
          {
            startAt: SLC_PM_START,
            endAt: SLC_PM_END,
            adventureId: shoreline.id,
            type: 'primary',
          },
        ]);
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
