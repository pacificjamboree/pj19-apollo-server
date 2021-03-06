const { fromGlobalId } = require('graphql-relay-tools/dist/node');
const { PatrolScouter } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const getPatrolScouter = input =>
  PatrolScouter.query()
    .where(whereSearchField(input))
    .eager('[patrols.[adventureSelection], user]')
    .first();

const getPatrolScouters = ({
  workflowState = 'active',
  name,
  patrolNumber,
  importId,
}) => {
  const nameFilter = (qb, name) => {
    if (name === undefined) return;
    qb.where('firstName', 'ilike', `${name}%`).orWhere(
      'lastName',
      'ilike',
      `${name}%`
    );
  };

  const patrolNumberFilter = (qb, patrolNumber) => {
    if (patrolNumber === undefined) return;
    const knex = PatrolScouter.knex();
    qb.where(
      'patrol_id',
      knex.raw(
        `(SELECT id FROM patrol WHERE patrol_number = '${patrolNumber}')`
      )
    );
  };

  const importIdFilter = (qb, importId) => {
    if (importId !== undefined) {
      qb.andWhere({ importId });
    }
  };

  return PatrolScouter.query()
    .eager('[patrols.[adventureSelection], user]')
    .whereIn('workflowState', workflowState)
    .modify(nameFilter, name)
    .modify(patrolNumberFilter, patrolNumber)
    .modify(importIdFilter, importId);
};

const createPatrolScouter = async ({
  PatrolScouter: input,
  clientMutationId,
}) => {
  try {
    input.patrolId = fromGlobalId(input.patrolId).id;
    const patrolScouter = await PatrolScouter.query()
      .insert(input)
      .returning('*');
    return {
      PatrolScouter: patrolScouter,
    };
  } catch (e) {
    throw e;
  }
};

const updatePatrolScouter = async ({
  PatrolScouter: input,
  clientMutationId,
  id,
}) => {
  try {
    if (input.patrolId) {
      input.patrolId = fromGlobalId(input.patrolId).id;
    }
    const patrolScouter = await PatrolScouter.query()
      .patch(input)
      .where({ id: fromGlobalId(id).id })
      .returning('*')
      .first();
    return {
      PatrolScouter: patrolScouter,
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getPatrolScouter,
  getPatrolScouters,
  createPatrolScouter,
  updatePatrolScouter,
};
