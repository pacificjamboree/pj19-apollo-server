const { fromGlobalId } = require('graphql-relay-tools/dist/node');
const { transaction } = require('objection');
const { Patrol, PatrolScouter, User } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const getPatrol = input =>
  Patrol.query()
    .where(whereSearchField(input))
    .eager('[patrolScouter, adventureSelection]')
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
    .eager('[patrolScouter, adventureSelection]')
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

const batchPatrols = async (
  { ImportPatrols, DeletePatrols },
  clientMutationId
) => {
  let ImportedPatrols = [];
  let DeletedPatrols = [];
  const knex = Patrol.knex();
  try {
    await transaction(knex, async t => {
      for (const patrol of ImportPatrols) {
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
              importId: patrol.importId,
              workflowState: 'active',
            })
            .returning('*');
        }

        // create users for the patrorScouter if one doesn't exist
        let user = await User.query()
          .where({ patrolScouterId: scouter.id })
          .first();
        if (!user) {
          user = await User.query().insert({
            patrolScouterId: scouter.id,
            username: scouter.email,
            workflowState: 'defined',
          });
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
            importId: patrol.importId,
            workflowState: 'active',
          })
          .returning('*');

        p.patrolScouter = await p.$relatedQuery('patrolScouter');
        ImportedPatrols.push(p);
      }

      // Delete patrols
      const deletePatrolsIds = DeletePatrols.map(p => fromGlobalId(p).id);
      DeletedPatrols = await Patrol.query()
        .patch({ workflowState: 'deleted' })
        .whereIn('id', deletePatrolsIds)
        .returning('*');
    });
    return { ImportedPatrols, DeletedPatrols };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPatrol,
  getPatrols,
  createPatrol,
  updatePatrol,
  batchPatrols,
};
