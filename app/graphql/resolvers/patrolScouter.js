const { fromGlobalId } = require('graphql-relay-tools/dist/node');
const { PatrolScouter } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const getPatrolScouter = input =>
  PatrolScouter.query()
    .where(whereSearchField(input))
    .eager('patrol')
    .first();

const getPatrolScouters = ({
  workflowState = 'active',
  name,
  patrolNumber,
}) => {
  const nameFilter = (qb, name) => {
    if (name === undefined) return;
    qb
      .where('firstName', 'ilike', `${name}%`)
      .orWhere('lastName', 'ilike', `${name}%`);
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

  return PatrolScouter.query()
    .whereIn('workflowState', workflowState)
    .modify(nameFilter, name)
    .modify(patrolNumberFilter, patrolNumber);
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

module.exports = {
  getPatrolScouter,
  getPatrolScouters,
  createPatrolScouter,
};
