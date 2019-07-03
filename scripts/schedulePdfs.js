const { Patrol } = require('../app/models');
const {
  queues: { PATROL_SCHEDULE_PDF },
} = require('../app/queues');

const main = async () => {
  try {
    const patrols = await Patrol.query().where({ workflowState: 'active' });

    for (const patrol of patrols) {
      await PATROL_SCHEDULE_PDF.add({
        id: patrol.id,
        patrolNumber: patrol.patrolNumber,
        subcamp: patrol.subcamp,
      });
    }
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(255);
  }
};

main();
