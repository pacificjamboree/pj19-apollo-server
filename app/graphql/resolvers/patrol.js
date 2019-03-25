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
  { ImportPatrols, DeletePatrols, PatchPatrols },
  clientMutationId
) => {
  let ImportedPatrols = [];
  let DeletedPatrols = [];
  let PatchedPatrols = [];
  let PatchedScouters = [];

  const knex = Patrol.knex();
  try {
    await transaction(knex, async t => {
      for (const patrol of ImportPatrols) {
        // does patrolScouter exist?
        let scouter = await PatrolScouter.query(t)
          .where({ email: patrol.email })
          .returning('id')
          .first();

        // if not, create one
        if (!scouter) {
          scouter = await PatrolScouter.query(t)
            .insert({
              email: patrol.email,
              importId: patrol.importId,
              workflowState: 'active',
            })
            .returning('*');
        }

        // create users for the patrorScouter if one doesn't exist
        let user = await User.query(t)
          .where({ patrolScouterId: scouter.id })
          .first();
        if (!user) {
          user = await User.query(t).insert({
            patrolScouterId: scouter.id,
            username: scouter.email,
            workflowState: 'defined',
          });
        }

        // now create the patrol with the patrolScouter ID as FK
        const p = await Patrol.query(t)
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
      DeletedPatrols = await Patrol.query(t)
        .patch({ workflowState: 'deleted' })
        .whereIn('id', deletePatrolsIds)
        .returning('*');

      // Patch changed patrols
      // Patches may include email addresses which belong
      // to the PatrolScouter model, not Patrol.
      const emailPatches = PatchPatrols.filter(p =>
        p.hasOwnProperty('email')
      ).map(({ patrolScouterId, email }) => ({
        patrolScouterId,
        email,
      }));

      const patrolScouterPatchPronmises = emailPatches.map(patch =>
        PatrolScouter.query(t)
          .where({
            id: fromGlobalId(patch.patrolScouterId).id,
          })
          .patch({ email: patch.email })
          .returning('*')
      );

      const userPatchPromises = emailPatches.map(patch =>
        User.query(t)
          .where({
            patrolScouterId: fromGlobalId(patch.patrolScouterId).id,
          })
          .patch({ username: patch.email })
      );
      PatchedScouters = await Promise.all(patrolScouterPatchPronmises);
      await Promise.all(userPatchPromises);

      const patchPromsises = PatchPatrols.map(patch => {
        const id = fromGlobalId(patch.id).id;
        delete patch.id;
        delete patch.patrolScouterId;
        if (patch.email) {
          delete patch.email;
        }
        if (Object.keys(patch).length > 0) {
          return Patrol.query(t)
            .where({ id })
            .patch(patch)
            .returning('*');
        } else {
          return null;
        }
      });
      PatchedPatrols = await Promise.all(patchPromsises.filter(p => p));
    });
    return { ImportedPatrols, DeletedPatrols, PatchedPatrols, PatchedScouters };
  } catch (error) {
    console.log(error);
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
