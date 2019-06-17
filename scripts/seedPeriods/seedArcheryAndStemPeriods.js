// ARCHERY IS PAIRED WITH ESCAPE ROOM AND SPHEROS

const { Adventure, AdventurePeriod } = require('../../app/models');
const { transaction } = require('objection');
const addMinutes = require('date-fns/add_minutes');
const knex = AdventurePeriod.knex();

const ARCHERY_DURATION_MIN = 90;
const STEM_DURATION_MIN = 90;

const MF_DAYS = [8, 9, 10, 11, 12];

const SUNDAY_START = new Date(2019, 6, 7, 14, 0);

////////// SUNDAY: GROUP 1 STARTS WITH ARCHERY -> ESCAPE_ROOM & SPHEROS

const SUNDAY_ARCHERY_1_START = SUNDAY_START;
const SUNDAY_ARCHERY_1_END = addMinutes(SUNDAY_START, ARCHERY_DURATION_MIN);

const SUNDAY_ESCAPE_ROOM_1_START = SUNDAY_ARCHERY_1_END;
const SUNDAY_ESCAPE_ROOM_1_END = addMinutes(
  SUNDAY_ESCAPE_ROOM_1_START,
  STEM_DURATION_MIN
);
const SUNDAY_SPHEROS_1_START = SUNDAY_ESCAPE_ROOM_1_START;
const SUNDAY_SPHEROS_1_END = SUNDAY_ESCAPE_ROOM_1_END;

////////// SUNDAY: GROUP 2 STARTS WITH ESCAPE_ROOM & SPHEROS -> ARCHERY

const SUNDAY_ESCAPE_ROOM_2_START = SUNDAY_START;
const SUNDAY_ESCAPE_ROOM_2_END = addMinutes(
  SUNDAY_ESCAPE_ROOM_2_START,
  STEM_DURATION_MIN
);

const SUNDAY_SPHEROS_2_START = SUNDAY_ESCAPE_ROOM_2_START;
const SUNDAY_SPHEROS_2_END = SUNDAY_ESCAPE_ROOM_2_END;

const SUNDAY_ARCHERY_2_START = SUNDAY_ARCHERY_1_END;
const SUNDAY_ARCHERY_2_END = addMinutes(
  SUNDAY_ARCHERY_2_START,
  ARCHERY_DURATION_MIN
);

const seeder = async () => {
  try {
    // find archery, stem_escape_room, stem_spheros
    const archery = await Adventure.query()
      .where({ adventureCode: 'archery' })
      .returning('id')
      .first();
    const escapeRoom = await Adventure.query()
      .where({ adventureCode: 'stem_escape_room' })
      .returning('id')
      .first();
    const spheros = await Adventure.query()
      .where({ adventureCode: 'stem_spheros' })
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
          type: 'primary',
        })
        .returning('id');
      const sundaySpheros1 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_SPHEROS_1_START,
          endAt: SUNDAY_SPHEROS_1_END,
          adventureId: spheros.id,
          type: 'primary',
        })
        .returning('id');
      // make archery period and add stem IDs to assignWith
      await AdventurePeriod.query(t).insert({
        startAt: SUNDAY_ARCHERY_1_START,
        endAt: SUNDAY_ARCHERY_1_END,
        adventureId: archery.id,
        assignWith: JSON.stringify([sundayEscapeRoom1.id, sundaySpheros1.id]),
        type: 'primary',
      });

      // sunday group 2
      // same as above, just flipped
      const sundayEscapeRoom2 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_ESCAPE_ROOM_2_START,
          endAt: SUNDAY_ESCAPE_ROOM_2_END,
          adventureId: escapeRoom.id,
          type: 'primary',
        })
        .returning('id');
      const sundaySpheros2 = await AdventurePeriod.query(t)
        .insert({
          startAt: SUNDAY_SPHEROS_2_START,
          endAt: SUNDAY_SPHEROS_2_END,
          adventureId: spheros.id,
          type: 'primary',
        })
        .returning('id');
      // make archery period and add stem IDs to assignWith
      await AdventurePeriod.query(t).insert({
        startAt: SUNDAY_ARCHERY_2_START,
        endAt: SUNDAY_ARCHERY_2_END,
        adventureId: archery.id,
        assignWith: JSON.stringify([sundayEscapeRoom2.id, sundaySpheros2.id]),
        type: 'primary',
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
        const AM_SPHEROS_1_START = AM_ESCAPE_ROOM_1_START;
        const AM_SPHEROS_1_END = AM_ESCAPE_ROOM_1_END;

        // morning group 2
        const AM_ESCAPE_ROOM_2_START = AM_START;
        const AM_ESCAPE_ROOM_2_END = addMinutes(
          AM_ESCAPE_ROOM_2_START,
          STEM_DURATION_MIN
        );
        const AM_SPHEROS_2_START = AM_ESCAPE_ROOM_2_START;
        const AM_SPHEROS_2_END = AM_ESCAPE_ROOM_2_END;
        const AM_ARCHERY_2_START = AM_SPHEROS_2_END;
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
        const PM_SPHEROS_1_START = PM_ESCAPE_ROOM_1_START;
        const PM_SPHEROS_1_END = PM_ESCAPE_ROOM_1_END;

        // afternoon group 2
        const PM_ESCAPE_ROOM_2_START = PM_START;
        const PM_ESCAPE_ROOM_2_END = addMinutes(
          PM_ESCAPE_ROOM_2_START,
          STEM_DURATION_MIN
        );
        const PM_SPHEROS_2_START = PM_ESCAPE_ROOM_2_START;
        const PM_SPHEROS_2_END = PM_ESCAPE_ROOM_2_END;
        const PM_ARCHERY_2_START = PM_SPHEROS_2_END;
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
            type: 'primary',
          })
          .returning('id');
        const mfAmspheros1 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_SPHEROS_1_START,
            endAt: AM_SPHEROS_1_END,
            adventureId: spheros.id,
            type: 'primary',
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: AM_ARCHERY_1_START,
          endAt: AM_ARCHERY_1_END,
          adventureId: archery.id,
          assignWith: JSON.stringify([mfAmEscapeRoom1.id, mfAmspheros1.id]),
          type: 'primary',
        });

        // AM group 2
        const mfAmEscapeRoom2 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_ESCAPE_ROOM_2_START,
            endAt: AM_ESCAPE_ROOM_2_END,
            adventureId: escapeRoom.id,
            type: 'primary',
          })
          .returning('id');
        const mfAmspheros2 = await AdventurePeriod.query(t)
          .insert({
            startAt: AM_SPHEROS_2_START,
            endAt: AM_SPHEROS_2_END,
            adventureId: spheros.id,
            type: 'primary',
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: AM_ARCHERY_2_START,
          endAt: AM_ARCHERY_2_END,
          adventureId: archery.id,
          assignWith: JSON.stringify([mfAmEscapeRoom2.id, mfAmspheros2.id]),
          type: 'primary',
        });

        // PM group 1
        // stem periods first to get ids
        const mfPmEscapeRoom1 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_ESCAPE_ROOM_1_START,
            endAt: PM_ESCAPE_ROOM_1_END,
            adventureId: escapeRoom.id,
            type: 'primary',
          })
          .returning('id');
        const mfPmspheros1 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_SPHEROS_1_START,
            endAt: PM_SPHEROS_1_END,
            adventureId: spheros.id,
            type: 'primary',
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: PM_ARCHERY_1_START,
          endAt: PM_ARCHERY_1_END,
          adventureId: archery.id,
          assignWith: JSON.stringify([mfPmEscapeRoom1.id, mfPmspheros1.id]),
          type: 'primary',
        });

        // PM group 2
        const mfPmEscapeRoom2 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_ESCAPE_ROOM_2_START,
            endAt: PM_ESCAPE_ROOM_2_END,
            adventureId: escapeRoom.id,
            type: 'primary',
          })
          .returning('id');
        const mfPmspheros2 = await AdventurePeriod.query(t)
          .insert({
            startAt: PM_SPHEROS_2_START,
            endAt: PM_SPHEROS_2_END,
            adventureId: spheros.id,
            type: 'primary',
          })
          .returning('id');
        await AdventurePeriod.query(t).insert({
          startAt: PM_ARCHERY_2_START,
          endAt: PM_ARCHERY_2_END,
          adventureId: archery.id,
          assignWith: JSON.stringify([mfPmEscapeRoom2.id, mfPmspheros2.id]),
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
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(255);
  }
};

if (require.main === module) {
  main();
}

module.exports = seeder;
