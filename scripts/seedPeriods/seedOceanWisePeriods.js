const { Adventure, AdventurePeriod } = require('../../app/models');
const { transaction } = require('objection');
const knex = AdventurePeriod.knex();

const DAYS = [9, 10];

const seeder = async () => {
  try {
    await transaction(knex, async t => {
      const oceanwise = await Adventure.query(t)
        .where({
          adventureCode: 'stem_oceanwise',
        })
        .first();

      const free1 = await Adventure.query(t)
        .where({ adventureCode: 'free1' })
        .first();

      for (const d of DAYS) {
        const AM1_START = new Date(2019, 6, d, 8, 30);
        const AM1_END = new Date(2019, 6, d, 9, 30);
        const AM2_START = new Date(2019, 6, d, 9, 30);
        const AM2_END = new Date(2019, 6, d, 10, 30);
        const AM3_START = new Date(2019, 6, d, 10, 30);
        const AM3_END = new Date(2019, 6, d, 11, 30);

        const PM1_START = new Date(2019, 6, d, 14, 0);
        const PM1_END = new Date(2019, 6, d, 15, 0);
        const PM2_START = new Date(2019, 6, d, 15, 0);
        const PM2_END = new Date(2019, 6, d, 16, 0);
        const PM3_START = new Date(2019, 6, d, 16, 0);
        const PM3_END = new Date(2019, 6, d, 17, 0);

        // MORNING
        // group 1: ow, fp, fp
        // make free periods first to get ids
        const fp1_1am = await AdventurePeriod.query(t)
          .insert({
            startAt: AM2_START,
            endAt: AM2_END,
            adventureId: free1.id,
            type: 'primary',
          })
          .returning('id');

        const fp2_1am = await AdventurePeriod.query(t)
          .insert({
            startAt: AM3_START,
            endAt: AM3_END,
            adventureId: free1.id,
            type: 'primary',
          })
          .returning('id');

        // insert ow period
        await AdventurePeriod.query(t)
          .insert({
            startAt: AM1_START,
            endAt: AM1_END,
            adventureId: oceanwise.id,
            type: 'primary',
            assignWith: JSON.stringify([fp1_1am.id, fp2_1am.id]),
          })
          .returning('id');

        // group 2: fp, ow, fp
        const fp1_2am = await AdventurePeriod.query(t)
          .insert({
            startAt: AM1_START,
            endAt: AM1_END,
            adventureId: free1.id,
            type: 'primary',
          })
          .returning('id');

        const fp2_2am = await AdventurePeriod.query(t)
          .insert({
            startAt: AM3_START,
            endAt: AM3_END,
            adventureId: free1.id,
            type: 'primary',
          })
          .returning('id');

        // insert ow period
        await AdventurePeriod.query(t)
          .insert({
            startAt: AM2_START,
            endAt: AM2_END,
            adventureId: oceanwise.id,
            type: 'primary',
            assignWith: JSON.stringify([fp1_2am.id, fp2_2am.id]),
          })
          .returning('id');

        // group 3: fp, fp, ow
        const fp1_3am = await AdventurePeriod.query(t)
          .insert({
            startAt: AM1_START,
            endAt: AM1_END,
            adventureId: free1.id,
            type: 'primary',
          })
          .returning('id');

        const fp2_3am = await AdventurePeriod.query(t)
          .insert({
            startAt: AM2_START,
            endAt: AM2_END,
            adventureId: free1.id,
            type: 'primary',
          })
          .returning('id');

        // insert ow period
        await AdventurePeriod.query(t)
          .insert({
            startAt: AM3_START,
            endAt: AM3_END,
            adventureId: oceanwise.id,
            type: 'primary',
            assignWith: JSON.stringify([fp1_3am.id, fp2_3am.id]),
          })
          .returning('id');

        // AFTERNOON
        // group 1: ow, fp, fp
        // make free periods first to get ids
        const fp1_1pm = await AdventurePeriod.query(t)
          .insert({
            startAt: PM2_START,
            endAt: PM2_END,
            adventureId: free1.id,
            type: 'primary',
          })
          .returning('id');

        const fp2_1pm = await AdventurePeriod.query(t)
          .insert({
            startAt: PM3_START,
            endAt: PM3_END,
            adventureId: free1.id,
            type: 'primary',
          })
          .returning('id');

        // insert ow period
        await AdventurePeriod.query(t)
          .insert({
            startAt: PM1_START,
            endAt: PM1_END,
            adventureId: oceanwise.id,
            type: 'primary',
            assignWith: JSON.stringify([fp1_1pm.id, fp2_1pm.id]),
          })
          .returning('id');

        // group 2: fp, ow, fp
        const fp1_2pm = await AdventurePeriod.query(t)
          .insert({
            startAt: PM1_START,
            endAt: PM1_END,
            adventureId: free1.id,
            type: 'primary',
          })
          .returning('id');

        const fp2_2pm = await AdventurePeriod.query(t)
          .insert({
            startAt: PM3_START,
            endAt: PM3_END,
            adventureId: free1.id,
            type: 'primary',
          })
          .returning('id');

        // insert ow period
        await AdventurePeriod.query(t)
          .insert({
            startAt: PM2_START,
            endAt: PM2_END,
            adventureId: oceanwise.id,
            type: 'primary',
            assignWith: JSON.stringify([fp1_2pm.id, fp2_2pm.id]),
          })
          .returning('id');

        // group 3: fp, fp, ow
        const fp1_3pm = await AdventurePeriod.query(t)
          .insert({
            startAt: PM1_START,
            endAt: PM1_END,
            adventureId: free1.id,
            type: 'primary',
          })
          .returning('id');

        const fp2_3pm = await AdventurePeriod.query(t)
          .insert({
            startAt: PM2_START,
            endAt: PM2_END,
            adventureId: free1.id,
            type: 'primary',
          })
          .returning('id');

        // insert ow period
        await AdventurePeriod.query(t)
          .insert({
            startAt: PM3_START,
            endAt: PM3_END,
            adventureId: oceanwise.id,
            type: 'primary',
            assignWith: JSON.stringify([fp1_3pm.id, fp2_3pm.id]),
          })
          .returning('id');
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
