const { AdventurePeriod } = require('../../app/models');
const { transaction } = require('objection');
const knex = AdventurePeriod.knex();

const SQL = `
select "adventure".* from "adventure" 
where (
  hidden = false and 
  "workflow_state" = 'active' and 
  "periods_required" = '1' and 
  "adventure_code" not in ('archery', 'stem', 'stem_oceanwise', 'stem_shoreline', 'fencing')) 
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

const main = async () => {
  try {
    const adventures = await knex.raw(SQL);
    await transaction(knex, async t => {
      for (let adventure of adventures.rows) {
        for (let p of HALF_DAY_PERIODS) {
          await AdventurePeriod.query(t).insert({
            ...p,
            adventureId: adventure.id,
          });
        }
      }
    });
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(255);
  }
};

main();
