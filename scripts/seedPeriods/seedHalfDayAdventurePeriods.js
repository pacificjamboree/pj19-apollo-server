const { Adventure, AdventurePeriod } = require('../../app/models');
const { transaction } = require('objection');
const knex = AdventurePeriod.knex();

const SQL = `
select "adventure".* from "adventure" 
where (
  hidden = false and 
  "workflow_state" = 'active' and 
  "periods_required" = '1' and 
  "adventure_code" not in ('archery', 'stem', 'stem_oceanwise', 'stem_shoreline', 'stem_moon', 'stem_spheros', 'stem_ar_vr', 'stem_escape_room', 'fencing', 'swimming'))
  or adventure_code = 'free'`;

const HALF_DAY_PERIODS = [
  ...new Set(
    [].concat(
      {
        startAt: new Date(2019, 6, 7, 14),
        endAt: new Date(2019, 6, 7, 17),
      },
      ...[8, 9, 10, 11, 12].map(x => [
        {
          startAt: new Date(2019, 6, x, 8, 30),
          endAt: new Date(2019, 6, x, 11, 30),
        },
        { startAt: new Date(2019, 6, x, 14), endAt: new Date(2019, 6, x, 17) },
      ])
    )
  ),
];

const seeder = async () => {
  try {
    const adventures = await knex.raw(SQL);
    await transaction(knex, async t => {
      for (let adventure of adventures.rows) {
        for (let p of HALF_DAY_PERIODS) {
          await AdventurePeriod.query(t).insert({
            ...p,
            adventureId: adventure.id,
            type: 'primary',
          });
        }
      }

      // also make swimming while we're here
      // these will need to be manually adjusted to their *real* start/end times
      // but for now setting them to 1400/1700 so that the scheduling scripts
      // don't break
      const swimming = await Adventure.query()
        .where({
          adventureCode: 'swimming',
        })
        .first();
      const swimmingPeriods = [8, 9, 10, 11, 12].map(d => ({
        adventureId: swimming.id,
        startAt: new Date(2019, 6, d, 14, 0),
        endAt: new Date(2019, 6, d, 17, 0),
        type: 'primary',
      }));

      await AdventurePeriod.query(t).insert(swimmingPeriods);
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
