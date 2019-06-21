const { Patrol } = require('../app/models');
const {
  queues: { PATROL_SCHEDULE_PDF },
} = require('../app/queues');

const main = async () => {
  try {
    const patrols = await Patrol.query()
      .where({ workflowState: 'active' })
      .select('id');

    for (const patrol of patrols) {
      PATROL_SCHEDULE_PDF.add({ id: patrol.id });
    }
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(255);
  }
};

main();
