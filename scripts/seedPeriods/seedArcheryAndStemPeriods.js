const { Adventure, AdventurePeriod } = require('../../app/models');
const { transaction } = require('objection');
const addMinutes = require('date-fns/add_minutes');
const knex = AdventurePeriod.knex();

const ARCHERY_DURATION_MIN = 90;
const STEM_DURATION_MIN = 45;

const MF_DAYS = [8, 9, 10, 11, 12];

const SUNDAY_START = new Date(2019, 6, 13, 14, 0);
////////// SUNDAY: GROUP 1 STARTS WITH ARCHERY -> ESCAPE_ROOM -> MOON

const SUNDAY_ARCHERY_1_START = SUNDAY_START;
const SUNDAY_ARCHERY_1_END = addMinutes(SUNDAY_START, ARCHERY_DURATION_MIN);

const SUNDAY_ESCAPE_ROOM_1_START = SUNDAY_ARCHERY_1_END;
const SUNDAY_ESCAPE_ROOM_1_END = addMinutes(
  SUNDAY_ESCAPE_ROOM_1_START,
  STEM_DURATION_MIN
);
const SUNDAY_MOON_1_START = SUNDAY_ESCAPE_ROOM_1_END;
const SUNDAY_MOON_1_END = addMinutes(SUNDAY_MOON_1_START, STEM_DURATION_MIN);

////////// SUNDAY: GROUP 2 STARTS WITH ESCAPE_ROOM -> MOON -> ARCHERY

const SUNDAY_ESCAPE_ROOM_2_START = SUNDAY_START;
const SUNDAY_ESCAPE_ROOM_2_END = addMinutes(
  SUNDAY_ESCAPE_ROOM_2_START,
  STEM_DURATION_MIN
);

const SUNDAY_MOON_2_START = SUNDAY_ESCAPE_ROOM_2_END;
const SUNDAY_MOON_2_END = addMinutes(SUNDAY_MOON_2_START, STEM_DURATION_MIN);

const SUNDAY_ARCHERY_2_START = SUNDAY_ARCHERY_1_END;
const SUNDAY_ARCHERY_2_END = addMinutes(
  SUNDAY_ARCHERY_2_START,
  ARCHERY_DURATION_MIN
);

const main = async () => {
  try {
    // find archery, stem_escape_room, stem_moon
    const archery = await Adventure.query()
      .where({ adventureCode: 'archery' })
      .returning('id')
      .first();
    const escapeRoom = await Adventure.query()
      .where({ adventureCode: 'stem_escape_room' })
      .returning('id')
      .first();
    const moon = await Adventure.query()
      .where({ adventureCode: 'stem_moon' })
      .returning('id')
      .first();

    // make sunday groups
    await transaction(knex, async t => {
      // sunday group 1
      // make stem periods first and get IDs
      const sundayEscapeRoom1 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_ESCAPE_ROOM_1_START,
          endAt: SUNDAY_ESCAPE_ROOM_1_END,
          adventureId: escapeRoom.id,
        })
        .returning('id');
      const sundayMoon1 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_MOON_1_START,
          endAt: SUNDAY_MOON_1_END,
          adventureId: moon.id,
        })
        .returning('id');
      // make archery period and add stem IDs to assignWith
      await AdventurePeriod.query(t).insert({
        startAt: SUNDAY_ARCHERY_1_START,
        endAt: SUNDAY_ARCHERY_1_END,
        adventureId: archery.id,
        assignWith: JSON.stringify([sundayEscapeRoom1.id, sundayMoon1.id]),
      });

      // sunday group 2
      // same as above, just flipped
      const sundayEscapeRoom2 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_ESCAPE_ROOM_2_START,
          endAt: SUNDAY_ESCAPE_ROOM_2_END,
          adventureId: escapeRoom.id,
        })
        .returning('id');
      const sundayMoon2 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_MOON_2_START,
          endAt: SUNDAY_MOON_2_END,
          adventureId: moon.id,
        })
        .returning('id');
      // make archery period and add stem IDs to assignWith
      await AdventurePeriod.query(t).insert({
        startAt: SUNDAY_ARCHERY_2_START,
        endAt: SUNDAY_ARCHERY_2_END,
        adventureId: archery.id,
        assignWith: JSON.stringify([sundayEscapeRoom2.id, sundayMoon2.id]),
      });

      // now make the monday-friday groups
      for (const D of MF_DAYS) {
        // define periods
        const AM_START = new Date(2019, 6, D, 8, 30);
        const PM_START = new Date(2019, 6, D, 14, 0);

        // morning group 1
        const AM_ARCHERY_1_START = AM_START;
        const AM_ARCHERY_1_END = addMinutes(
          AM_ARCHERY_1_START,
          ARCHERY_DURATION_MIN
        );
        const AM_ESCAPE_ROOM_1_START = AM_ARCHERY_1_END;
        const AM_ESCAPE_ROOM_1_END = addMinutes(
          AM_ESCAPE_ROOM_1_START,
          STEM_DURATION_MIN
        );
        const AM_MOON_1_START = AM_ESCAPE_ROOM_1_END;
        const AM_MOON_1_END = addMinutes(AM_MOON_1_START, STEM_DURATION_MIN);

        // morning group 2
        const AM_ESCAPE_ROOM_2_START = AM_START;
        const AM_ESCAPE_ROOM_2_END = addMinutes(
          AM_ESCAPE_ROOM_2_START,
          STEM_DURATION_MIN
        );
        const AM_MOON_2_START = AM_ESCAPE_ROOM_2_END;
        const AM_MOON_2_END = addMinutes(AM_MOON_2_START, STEM_DURATION_MIN);
        const AM_ARCHERY_2_START = AM_MOON_2_END;
        const AM_ARCHERY_2_END = addMinutes(
          AM_ARCHERY_2_START,
          ARCHERY_DURATION_MIN
        );

        // afternoon group 1
        const PM_ARCHERY_1_START = PM_START;
        const PM_ARCHERY_1_END = addMinutes(
          PM_ARCHERY_1_START,
          ARCHERY_DURATION_MIN
        );
        const PM_ESCAPE_ROOM_1_START = PM_ARCHERY_1_END;
        const PM_ESCAPE_ROOM_1_END = addMinutes(
          PM_ESCAPE_ROOM_1_START,
          STEM_DURATION_MIN
        );
        const PM_MOON_1_START = PM_ESCAPE_ROOM_1_END;
        const PM_MOON_1_END = addMinutes(PM_MOON_1_START, STEM_DURATION_MIN);

        // afternoon group 2
        const PM_ESCAPE_ROOM_2_START = PM_START;
        const PM_ESCAPE_ROOM_2_END = addMinutes(
          PM_ESCAPE_ROOM_2_START,
          STEM_DURATION_MIN
        );
        const PM_MOON_2_START = PM_ESCAPE_ROOM_2_END;
        const PM_MOON_2_END = addMinutes(PM_MOON_2_START, STEM_DURATION_MIN);
        const PM_ARCHERY_2_START = PM_MOON_2_END;
        const PM_ARCHERY_2_END = addMinutes(
          PM_ARCHERY_2_START,
          ARCHERY_DURATION_MIN
        );

        // make periods
        // AM group 1
        // stem periods first to get ids
        const mfAmEscapeRoom1 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_ESCAPE_ROOM_1_START,
            endAt: AM_ESCAPE_ROOM_1_END,
            adventureId: escapeRoom.id,
          })
          .returning('id');
        const mfAmmoon1 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_MOON_1_START,
            endAt: AM_MOON_1_END,
            adventureId: moon.id,
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: AM_ARCHERY_1_START,
          endAt: AM_ARCHERY_1_END,
          adventureId: archery.id,
          assignWith: JSON.stringify([mfAmEscapeRoom1.id, mfAmmoon1.id]),
        });

        // AM group 2
        const mfAmEscapeRoom2 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_ESCAPE_ROOM_2_START,
            endAt: AM_ESCAPE_ROOM_2_END,
            adventureId: escapeRoom.id,
          })
          .returning('id');
        const mfAmmoon2 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_MOON_2_START,
            endAt: AM_MOON_2_END,
            adventureId: moon.id,
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: AM_ARCHERY_2_START,
          endAt: AM_ARCHERY_2_END,
          adventureId: archery.id,
          assignWith: JSON.stringify([mfAmEscapeRoom2.id, mfAmmoon2.id]),
        });

        // PM group 1
        // stem periods first to get ids
        const mfPmEscapeRoom1 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_ESCAPE_ROOM_1_START,
            endAt: PM_ESCAPE_ROOM_1_END,
            adventureId: escapeRoom.id,
          })
          .returning('id');
        const mfPmmoon1 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_MOON_1_START,
            endAt: PM_MOON_1_END,
            adventureId: moon.id,
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: PM_ARCHERY_1_START,
          endAt: PM_ARCHERY_1_END,
          adventureId: archery.id,
          assignWith: JSON.stringify([mfPmEscapeRoom1.id, mfPmmoon1.id]),
        });

        // PM group 2
        const mfPmEscapeRoom2 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_ESCAPE_ROOM_2_START,
            endAt: PM_ESCAPE_ROOM_2_END,
            adventureId: escapeRoom.id,
          })
          .returning('id');
        const mfPmmoon2 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_MOON_2_START,
            endAt: PM_MOON_2_END,
            adventureId: moon.id,
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: PM_ARCHERY_2_START,
          endAt: PM_ARCHERY_2_END,
          adventureId: archery.id,
          assignWith: JSON.stringify([mfPmEscapeRoom2.id, mfPmmoon2.id]),
        });
      }
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(255);
  }
};

main();
