const { fromGlobalId } = require('graphql-relay-tools/dist/node');
const { Patrol, PatrolScouter } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const getPatrol = input =>
  Patrol.query()
    .where(whereSearchField(input))
    .eager('patrolScouter')
    .first();

const getPatrols = ({ workflowState = 'active', name, fullyPaid }) => {
  const nameFilter = (qb, name) => {
    if (name !== undefined) {
      qb.where('name', 'ilike', `%${name}%`);
    }
  };

  const fullyPaidFilter = (qb, fullyPaid) => {
    if (fullyPaid === undefined) return;
    const FIELD = 'final_payment_received';
    fullyPaid ? qb.whereNotNull(FIELD) : qb.whereNull(FIELD);
  };

  return Patrol.query()
    .eager('patrolScouter')
    .whereIn('workflowState', workflowState)
    .modify(nameFilter, name)
    .modify(fullyPaidFilter, fullyPaid);
};

const createPatrol = async ({ Patrol: input, clientMutationId }) => {
  try {
    const patrol = await Patrol.query()
      .insert(input)
      .returning('*');
    return {
      Patrol: patrol,
    };
  } catch (e) {
    throw e;
  }
};

const updatePatrol = async ({ Patrol: input, clientMutationId, id }) => {
  try {
    const patrol = await Patrol.query()
      .patch(input)
      .where({ id: fromGlobalId(id).id })
      .returning('*')
      .first();
    return {
      Patrol: patrol,
    };
  } catch (e) {
    throw e;
  }
};

const batchImportPatrols = async (
  { Patrols: newPatrols },
  clientMutationId
) => {
  let errors = [];
  let patrols = [];

  for (const patrol of newPatrols) {
    try {
      // does patrolScouter exist?
      let scouter = await PatrolScouter.query()
        .where({ email: patrol.email })
        .returning('id')
        .first();

      // if not, create one
      if (!scouter) {
        scouter = await PatrolScouter.query()
          .insert({
            firstName: patrol.firstName,
            lastName: patrol.lastName,
            phone: patrol.phone,
            email: patrol.email,
            workflowState: 'active',
          })
          .returning('id');
      }

      // now create the patrol with the patrolScouter ID as FK
      const p = await Patrol.query()
        .insert({
          patrolNumber: patrol.patrolNumber,
          subcamp: patrol.subcamp,
          groupName: patrol.groupName,
          patrolName: patrol.patrolName,
          numberOfScouts: patrol.numberOfScouts,
          numberOfScouters: patrol.numberOfScouters,
          patrolScouterId: scouter.id,
          workflowState: 'active',
        })
        .returning('*');

      p.patrolScouter = await p.$relatedQuery('patrolScouter');
      patrols.push(p);
    } catch (error) {
      patrols.push(error);
      // console.log({ error });
      // errors.push({ patrol, error });
    }
  }
  const ret = {
    newPatrols: patrols,
  };

  // if (errors.length) {
  //   ret.error = errors;
  // }
  return ret;
};

module.exports = {
  getPatrol,
  getPatrols,
  createPatrol,
  updatePatrol,
  batchImportPatrols,
};
