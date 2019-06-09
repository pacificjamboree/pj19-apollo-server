const { Adventure, AdventurePeriod, Patrol } = require('../app/models');
const createScheduleForPatrol = require('../app/lib/scheduling/createScheduleForPatrol');
process.env.DEBUG = 'scheduling:createScheduleForPatrol';

const main = async () => {
  try {
    const { PATROL } = process.env;

    if (PATROL) {
      const patrol = await Patrol.query()
        .eager('adventureSelection')
        .first()
        .where({
          workflowState: 'active',
          patrolNumber: PATROL,
        });
      await createScheduleForPatrol(patrol);
    } else {
      const knex = Patrol.knex();
      await knex.raw('TRUNCATE TABLE patrol_schedule');

      const fullyScheduled = [];
      const notFullyScheduled = [];

      // handle the two patrols that want thursday afternoon free
      const thursdayPmFreePatrols = await Patrol.query().whereIn(
        'patrolNumber',
        ['296', '324']
      );
      const freeWithPeriod = await Adventure.query()
        .where({ adventureCode: 'free' })
        .eager('periods')
        .modifyEager('periods', builder => {
          builder.where({ startAt: new Date(2019, 6, 11, 14, 0) }).first();
        })
        .first();

      for (const patrol of thursdayPmFreePatrols) {
        await patrol
          .$relatedQuery('schedule')
          .relate(freeWithPeriod.periods[0].id);
      }

      const patrols = await Patrol.query()
        .eager('adventureSelection')
        .where({ workflowState: 'active' })
        .orderBy('finalPaymentDate', 'asc')
        .orderBy('patrolNumber', 'asc');
      for (const patrol of patrols) {
        const result = await createScheduleForPatrol(patrol);
        const arr = result.fullyScheduled ? fullyScheduled : notFullyScheduled;
        arr.push(patrol.patrolNumber);
        console.log('\n\n');
      }

      console.log('Fully Scheduled:', fullyScheduled.length);
      console.log('Not Fully Scheduled:', notFullyScheduled.length);
      console.log(notFullyScheduled);
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(255);
  }
};

main();
