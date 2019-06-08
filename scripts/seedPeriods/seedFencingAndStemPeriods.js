const { Adventure, AdventurePeriod } = require('../../app/models');
const { transaction } = require('objection');
const addMinutes = require('date-fns/add_minutes');
const knex = AdventurePeriod.knex();

const DURATION = 60;
const SUNDAY_START = new Date(2019, 6, 7, 14, 0);
const MF_DAYS = [8, 9, 10, 11, 12];

const SUNDAY_1_START = new Date(2019, 6, 7, 14, 0);
const SUNDAY_1_END = new Date(2019, 6, 7, 15, 0);
const SUNDAY_2_START = new Date(2019, 6, 7, 15, 0);
const SUNDAY_2_END = new Date(2019, 6, 7, 16, 0);
const SUNDAY_3_START = new Date(2019, 6, 7, 16, 0);
const SUNDAY_3_END = new Date(2019, 6, 7, 17, 0);

// Fencing is paired with stem_spheros and stem_ar_vr

/*
  THREE GROUPS:
  FENCING -> SPHEROS -> AR/VR
  SPHEROS -> AR/VR -> FENCING
  AR/VR -> FENCING -> SPHEROS
*/

///////// SUNDAY
// fencing, spheros, arvr
const SUNDAY_FENCING_1_START = SUNDAY_1_START;
const SUNDAY_FENCING_1_END = SUNDAY_1_END;
const SUNDAY_SPHEROS_1_START = SUNDAY_2_START;
const SUNDAY_SPHEROS_1_END = SUNDAY_2_END;
const SUNDAY_ARVR_1_START = SUNDAY_3_START;
const SUNDAY_ARVR_1_END = SUNDAY_3_END;

// arvr, fencing, spheros
const SUNDAY_ARVR_2_START = SUNDAY_1_START;
const SUNDAY_ARVR_2_END = SUNDAY_1_END;
const SUNDAY_FENCING_2_START = SUNDAY_2_START;
const SUNDAY_FENCING_2_END = SUNDAY_2_END;
const SUNDAY_SPHEROS_2_START = SUNDAY_3_START;
const SUNDAY_SPHEROS_2_END = SUNDAY_3_END;

// spheros, arvr, fencing
const SUNDAY_SPHEROS_3_START = SUNDAY_1_START;
const SUNDAY_SPHEROS_3_END = SUNDAY_1_END;
const SUNDAY_ARVR_3_START = SUNDAY_2_START;
const SUNDAY_ARVR_3_END = SUNDAY_2_END;
const SUNDAY_FENCING_3_START = SUNDAY_3_START;
const SUNDAY_FENCING_3_END = SUNDAY_3_END;

const seeder = async () => {
  try {
    await transaction(knex, async t => {
      // get adventure IDs
      const fencing = await Adventure.query(t)
        .where({
          adventureCode: 'fencing',
        })
        .returning('id')
        .first();
      const spheros = await Adventure.query(t)
        .where({
          adventureCode: 'stem_spheros',
        })
        .returning('id')
        .first();
      const arvr = await Adventure.query(t)
        .where({
          adventureCode: 'stem_ar_vr',
        })
        .returning('id')
        .first();

      const sundaySpheros1 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_SPHEROS_1_START,
          endAt: SUNDAY_SPHEROS_1_END,
          adventureId: spheros.id,
          type: 'primary',
        })
        .returning('id');
      const sundayArVr1 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_ARVR_1_START,
          endAt: SUNDAY_ARVR_1_END,
          adventureId: arvr.id,
          type: 'primary',
        })
        .returning('id');
      await AdventurePeriod.query(t).insert({
        startAt: SUNDAY_FENCING_1_START,
        endAt: SUNDAY_FENCING_1_END,
        adventureId: fencing.id,
        assignWith: JSON.stringify([sundaySpheros1.id, sundayArVr1.id]),
        type: 'primary',
      });

      const sundaySpheros2 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_SPHEROS_2_START,
          endAt: SUNDAY_SPHEROS_2_END,
          adventureId: spheros.id,
          type: 'primary',
        })
        .returning('id');
      const sundayArVr2 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_ARVR_2_START,
          endAt: SUNDAY_ARVR_2_END,
          adventureId: arvr.id,
          type: 'primary',
        })
        .returning('id');
      await AdventurePeriod.query(t).insert({
        startAt: SUNDAY_FENCING_2_START,
        endAt: SUNDAY_FENCING_2_END,
        adventureId: fencing.id,
        assignWith: JSON.stringify([sundaySpheros2.id, sundayArVr2.id]),
        type: 'primary',
      });

      const sundaySpheros3 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_SPHEROS_3_START,
          endAt: SUNDAY_SPHEROS_3_END,
          adventureId: spheros.id,
          type: 'primary',
        })
        .returning('id');
      const sundayArVr3 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_ARVR_3_START,
          endAt: SUNDAY_ARVR_3_END,
          adventureId: arvr.id,
          type: 'primary',
        })
        .returning('id');
      await AdventurePeriod.query(t).insert({
        startAt: SUNDAY_FENCING_3_START,
        endAt: SUNDAY_FENCING_3_END,
        adventureId: fencing.id,
        assignWith: JSON.stringify([sundaySpheros3.id, sundayArVr3.id]),
        type: 'primary',
      });

      // Monday - Friday periods
      // same grouping order, just twice as many!
      for (const D of MF_DAYS) {
        const AM_START = new Date(2019, 6, D, 8, 30);
        const PM_START = new Date(2019, 6, D, 14, 0);

        // fencing, spheros, arvr
        const AM_FENCING_1_START = AM_START;
        const AM_FENCING_1_END = addMinutes(AM_FENCING_1_START, DURATION);
        const AM_SPHEROS_1_START = AM_FENCING_1_END;
        const AM_SPHEROS_1_END = addMinutes(AM_SPHEROS_1_START, DURATION);
        const AM_ARVR_1_START = AM_SPHEROS_1_END;
        const AM_ARVR_1_END = addMinutes(AM_ARVR_1_START, DURATION);

        // arvr, fencing, spheros
        const AM_ARVR_2_START = AM_START;
        const AM_ARVR_2_END = addMinutes(AM_ARVR_2_START, DURATION);
        const AM_FENCING_2_START = AM_ARVR_2_END;
        const AM_FENCING_2_END = addMinutes(AM_FENCING_2_START, DURATION);
        const AM_SPHEROS_2_START = AM_FENCING_2_END;
        const AM_SPHEROS_2_END = addMinutes(AM_SPHEROS_2_START, DURATION);

        // spheros, arvr, fencing
        const AM_SPHEROS_3_START = AM_START;
        const AM_SPHEROS_3_END = addMinutes(AM_SPHEROS_3_START, DURATION);
        const AM_ARVR_3_START = AM_SPHEROS_3_END;
        const AM_ARVR_3_END = addMinutes(AM_ARVR_3_START, DURATION);
        const AM_FENCING_3_START = AM_ARVR_3_END;
        const AM_FENCING_3_END = addMinutes(AM_FENCING_3_START, DURATION);

        // fencing, spheros, arvr
        const PM_FENCING_1_START = PM_START;
        const PM_FENCING_1_END = addMinutes(PM_FENCING_1_START, DURATION);
        const PM_SPHEROS_1_START = PM_FENCING_1_END;
        const PM_SPHEROS_1_END = addMinutes(PM_SPHEROS_1_START, DURATION);
        const PM_ARVR_1_START = PM_SPHEROS_1_END;
        const PM_ARVR_1_END = addMinutes(PM_ARVR_1_START, DURATION);

        // arvr, fencing, spheros
        const PM_ARVR_2_START = PM_START;
        const PM_ARVR_2_END = addMinutes(PM_ARVR_2_START, DURATION);
        const PM_FENCING_2_START = PM_ARVR_2_END;
        const PM_FENCING_2_END = addMinutes(PM_FENCING_2_START, DURATION);
        const PM_SPHEROS_2_START = PM_FENCING_2_END;
        const PM_SPHEROS_2_END = addMinutes(PM_SPHEROS_2_START, DURATION);

        // spheros, arvr, fencing
        const PM_SPHEROS_3_START = PM_START;
        const PM_SPHEROS_3_END = addMinutes(PM_SPHEROS_3_START, DURATION);
        const PM_ARVR_3_START = PM_SPHEROS_3_END;
        const PM_ARVR_3_END = addMinutes(PM_ARVR_3_START, DURATION);
        const PM_FENCING_3_START = PM_ARVR_3_END;
        const PM_FENCING_3_END = addMinutes(PM_FENCING_3_START, DURATION);

        // make periods
        // am group 1
        const amSpheros1 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_SPHEROS_1_START,
            endAt: AM_SPHEROS_1_END,
            adventureId: spheros.id,
            type: 'primary',
          })
          .returning('id');
        const amArVr1 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_ARVR_1_START,
            endAt: AM_ARVR_1_END,
            adventureId: arvr.id,
            type: 'primary',
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: AM_FENCING_1_START,
          endAt: AM_FENCING_1_END,
          adventureId: fencing.id,
          assignWith: JSON.stringify([amSpheros1.id, amArVr1.id]),
          type: 'primary',
        });

        // am group 2
        const amSpheros2 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_SPHEROS_2_START,
            endAt: AM_SPHEROS_2_END,
            adventureId: spheros.id,
            type: 'primary',
          })
          .returning('id');
        const amArVr2 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_ARVR_2_START,
            endAt: AM_ARVR_2_END,
            adventureId: arvr.id,
            type: 'primary',
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: AM_FENCING_2_START,
          endAt: AM_FENCING_2_END,
          adventureId: fencing.id,
          assignWith: JSON.stringify([amSpheros2.id, amArVr2.id]),
          type: 'primary',
        });

        // am group 3
        const amSpheros3 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_SPHEROS_3_START,
            endAt: AM_SPHEROS_3_END,
            adventureId: spheros.id,
            type: 'primary',
          })
          .returning('id');
        const amArVr3 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_ARVR_3_START,
            endAt: AM_ARVR_3_END,
            adventureId: arvr.id,
            type: 'primary',
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: AM_FENCING_3_START,
          endAt: AM_FENCING_3_END,
          adventureId: fencing.id,
          assignWith: JSON.stringify([amSpheros3.id, amArVr3.id]),
          type: 'primary',
        });

        // pm group 1
        const pmSpheros1 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_SPHEROS_1_START,
            endAt: PM_SPHEROS_1_END,
            adventureId: spheros.id,
            type: 'primary',
          })
          .returning('id');
        const pmArVr1 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_ARVR_1_START,
            endAt: PM_ARVR_1_END,
            adventureId: arvr.id,
            type: 'primary',
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: PM_FENCING_1_START,
          endAt: PM_FENCING_1_END,
          adventureId: fencing.id,
          assignWith: JSON.stringify([pmSpheros1.id, pmArVr1.id]),
          type: 'primary',
        });

        // pm group 2
        const pmSpheros2 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_SPHEROS_2_START,
            endAt: PM_SPHEROS_2_END,
            adventureId: spheros.id,
            type: 'primary',
          })
          .returning('id');
        const pmArVr2 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_ARVR_2_START,
            endAt: PM_ARVR_2_END,
            adventureId: arvr.id,
            type: 'primary',
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: PM_FENCING_2_START,
          endAt: PM_FENCING_2_END,
          adventureId: fencing.id,
          assignWith: JSON.stringify([pmSpheros2.id, pmArVr2.id]),
          type: 'primary',
        });

        // pm group 3
        const pmSpheros3 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_SPHEROS_3_START,
            endAt: PM_SPHEROS_3_END,
            adventureId: spheros.id,
            type: 'primary',
          })
          .returning('id');
        const pmArVr3 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_ARVR_3_START,
            endAt: PM_ARVR_3_END,
            adventureId: arvr.id,
            type: 'primary',
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: PM_FENCING_3_START,
          endAt: PM_FENCING_3_END,
          adventureId: fencing.id,
          assignWith: JSON.stringify([pmSpheros3.id, pmArVr3.id]),
          type: 'primary',
        });
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
    console.error();
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = seeder;
