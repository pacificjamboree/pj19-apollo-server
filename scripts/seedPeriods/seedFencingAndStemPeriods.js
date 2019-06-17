const { Adventure, AdventurePeriod } = require('../../app/models');
const { transaction } = require('objection');
const addMinutes = require('date-fns/add_minutes');
const knex = AdventurePeriod.knex();

const DURATION = 60;
const MF_DAYS = [8, 9, 10, 11, 12];

const SUNDAY_1_START = new Date(2019, 6, 7, 14, 0);
const SUNDAY_1_END = new Date(2019, 6, 7, 15, 0);
const SUNDAY_2_START = new Date(2019, 6, 7, 15, 0);
const SUNDAY_2_END = new Date(2019, 6, 7, 16, 0);
const SUNDAY_3_START = new Date(2019, 6, 7, 16, 0);
const SUNDAY_3_END = new Date(2019, 6, 7, 17, 0);

// Fencing is paired with stem_moon and stem_ar_vr

/*
  THREE GROUPS:
  FENCING -> MOON -> AR/VR
  MOON -> AR/VR -> FENCING
  AR/VR -> FENCING -> MOON
*/

///////// SUNDAY
// fencing, moon, arvr
const SUNDAY_FENCING_1_START = SUNDAY_1_START;
const SUNDAY_FENCING_1_END = SUNDAY_1_END;
const SUNDAY_MOON_1_START = SUNDAY_2_START;
const SUNDAY_MOON_1_END = SUNDAY_2_END;
const SUNDAY_ARVR_1_START = SUNDAY_3_START;
const SUNDAY_ARVR_1_END = SUNDAY_3_END;

// arvr, fencing, moon
const SUNDAY_ARVR_2_START = SUNDAY_1_START;
const SUNDAY_ARVR_2_END = SUNDAY_1_END;
const SUNDAY_FENCING_2_START = SUNDAY_2_START;
const SUNDAY_FENCING_2_END = SUNDAY_2_END;
const SUNDAY_MOON_2_START = SUNDAY_3_START;
const SUNDAY_MOON_2_END = SUNDAY_3_END;

// moon, arvr, fencing
const SUNDAY_MOON_3_START = SUNDAY_1_START;
const SUNDAY_MOON_3_END = SUNDAY_1_END;
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
      const moon = await Adventure.query(t)
        .where({
          adventureCode: 'stem_moon',
        })
        .returning('id')
        .first();
      const arvr = await Adventure.query(t)
        .where({
          adventureCode: 'stem_ar_vr',
        })
        .returning('id')
        .first();

      const sundayMoon1 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_MOON_1_START,
          endAt: SUNDAY_MOON_1_END,
          adventureId: moon.id,
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
        assignWith: JSON.stringify([sundayMoon1.id, sundayArVr1.id]),
        type: 'primary',
      });

      const sundayMoon2 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_MOON_2_START,
          endAt: SUNDAY_MOON_2_END,
          adventureId: moon.id,
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
        assignWith: JSON.stringify([sundayMoon2.id, sundayArVr2.id]),
        type: 'primary',
      });

      const sundayMoon3 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_MOON_3_START,
          endAt: SUNDAY_MOON_3_END,
          adventureId: moon.id,
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
        assignWith: JSON.stringify([sundayMoon3.id, sundayArVr3.id]),
        type: 'primary',
      });

      // Monday - Friday periods
      // same grouping order, just twice as many!
      for (const D of MF_DAYS) {
        const AM_START = new Date(2019, 6, D, 8, 30);
        const PM_START = new Date(2019, 6, D, 14, 0);

        // fencing, moon, arvr
        const AM_FENCING_1_START = AM_START;
        const AM_FENCING_1_END = addMinutes(AM_FENCING_1_START, DURATION);
        const AM_MOON_1_START = AM_FENCING_1_END;
        const AM_MOON_1_END = addMinutes(AM_MOON_1_START, DURATION);
        const AM_ARVR_1_START = AM_MOON_1_END;
        const AM_ARVR_1_END = addMinutes(AM_ARVR_1_START, DURATION);

        // arvr, fencing, moon
        const AM_ARVR_2_START = AM_START;
        const AM_ARVR_2_END = addMinutes(AM_ARVR_2_START, DURATION);
        const AM_FENCING_2_START = AM_ARVR_2_END;
        const AM_FENCING_2_END = addMinutes(AM_FENCING_2_START, DURATION);
        const AM_MOON_2_START = AM_FENCING_2_END;
        const AM_MOON_2_END = addMinutes(AM_MOON_2_START, DURATION);

        // moon, arvr, fencing
        const AM_MOON_3_START = AM_START;
        const AM_MOON_3_END = addMinutes(AM_MOON_3_START, DURATION);
        const AM_ARVR_3_START = AM_MOON_3_END;
        const AM_ARVR_3_END = addMinutes(AM_ARVR_3_START, DURATION);
        const AM_FENCING_3_START = AM_ARVR_3_END;
        const AM_FENCING_3_END = addMinutes(AM_FENCING_3_START, DURATION);

        // fencing, moon, arvr
        const PM_FENCING_1_START = PM_START;
        const PM_FENCING_1_END = addMinutes(PM_FENCING_1_START, DURATION);
        const PM_MOON_1_START = PM_FENCING_1_END;
        const PM_MOON_1_END = addMinutes(PM_MOON_1_START, DURATION);
        const PM_ARVR_1_START = PM_MOON_1_END;
        const PM_ARVR_1_END = addMinutes(PM_ARVR_1_START, DURATION);

        // arvr, fencing, moon
        const PM_ARVR_2_START = PM_START;
        const PM_ARVR_2_END = addMinutes(PM_ARVR_2_START, DURATION);
        const PM_FENCING_2_START = PM_ARVR_2_END;
        const PM_FENCING_2_END = addMinutes(PM_FENCING_2_START, DURATION);
        const PM_MOON_2_START = PM_FENCING_2_END;
        const PM_MOON_2_END = addMinutes(PM_MOON_2_START, DURATION);

        // moon, arvr, fencing
        const PM_MOON_3_START = PM_START;
        const PM_MOON_3_END = addMinutes(PM_MOON_3_START, DURATION);
        const PM_ARVR_3_START = PM_MOON_3_END;
        const PM_ARVR_3_END = addMinutes(PM_ARVR_3_START, DURATION);
        const PM_FENCING_3_START = PM_ARVR_3_END;
        const PM_FENCING_3_END = addMinutes(PM_FENCING_3_START, DURATION);

        // make periods
        // am group 1
        const amMoon1 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_MOON_1_START,
            endAt: AM_MOON_1_END,
            adventureId: moon.id,
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
          assignWith: JSON.stringify([amMoon1.id, amArVr1.id]),
          type: 'primary',
        });

        // am group 2
        const amMoon2 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_MOON_2_START,
            endAt: AM_MOON_2_END,
            adventureId: moon.id,
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
          assignWith: JSON.stringify([amMoon2.id, amArVr2.id]),
          type: 'primary',
        });

        // am group 3
        const amMoon3 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_MOON_3_START,
            endAt: AM_MOON_3_END,
            adventureId: moon.id,
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
          assignWith: JSON.stringify([amMoon3.id, amArVr3.id]),
          type: 'primary',
        });

        // pm group 1
        const pmMoon1 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_MOON_1_START,
            endAt: PM_MOON_1_END,
            adventureId: moon.id,
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
          assignWith: JSON.stringify([pmMoon1.id, pmArVr1.id]),
          type: 'primary',
        });

        // pm group 2
        const pmMoon2 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_MOON_2_START,
            endAt: PM_MOON_2_END,
            adventureId: moon.id,
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
          assignWith: JSON.stringify([pmMoon2.id, pmArVr2.id]),
          type: 'primary',
        });

        // pm group 3
        const pmMoon3 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_MOON_3_START,
            endAt: PM_MOON_3_END,
            adventureId: moon.id,
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
          assignWith: JSON.stringify([pmMoon3.id, pmArVr3.id]),
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
