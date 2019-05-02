const { fromGlobalId } = require('graphql-relay-tools/dist/node');
const { transaction, raw } = require('objection');
const {
  Patrol,
  PatrolScouter,
  PatrolAdventureSelection,
  User,
} = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const {
  queues: { SEND_EMAIL },
} = require('../../queues');

const getPatrol = input =>
  Patrol.query()
    .where(whereSearchField(input))
    .eager('[patrolScouter, patrolScouter.user, adventureSelection]')
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
    .eager('[patrolScouter, patrolScouter.user, adventureSelection]')
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

const updatePatrols = async ({ Patrols }) => {
  try {
    const knex = Patrol.knex();
    let result;
    await transaction(knex, async t => {
      const promises = Patrols.map(patrol => {
        const patch = { ...patrol };
        const { id } = patrol;
        delete patch.id;
        return Patrol.query(t)
          .patch(patch)
          .where({ id: fromGlobalId(id).id })
          .returning('*')
          .first();
      });
      result = await Promise.all(promises);
    });
    return { Patrols: result };
  } catch (error) {
    throw error;
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

  const welcomeEmailsToSend = [];

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
          welcomeEmailsToSend.push(scouter.email);
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

      emailPatches.forEach(patch => {
        welcomeEmailsToSend.push(patch.email);
      });

      const patrolScouterPatchPromises = emailPatches.map(patch =>
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

      // soft-delete patrol adventure selections
      const adventureSelectionPatchPromises = deletePatrolsIds.map(p =>
        PatrolAdventureSelection.query(t)
          .where({ id: p })
          .patch({ workflowState: 'deleted' })
      );
      await Promise.all(adventureSelectionPatchPromises);

      PatchedScouters = await Promise.all(patrolScouterPatchPromises);
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

    welcomeEmailsToSend.forEach(to => {
      SEND_EMAIL.add({ type: 'PATROL_WELCOME', data: { to } });
    });

    return { ImportedPatrols, DeletedPatrols, PatchedPatrols, PatchedScouters };
  } catch (error) {
    throw error;
  }
};

const totalPatrolCount = async () => {
  try {
    const { count } = await Patrol.query()
      .count('id')
      .where({ workflowState: 'active' })
      .first();
    return count || 0;
  } catch (error) {
    throw error;
  }
};

const totalScoutsCount = async () => {
  try {
    const { sum } = await Patrol.query()
      .sum('numberOfScouts')
      .where({ workflowState: 'active' })
      .first();
    return parseInt(sum) || 0;
  } catch (error) {
    throw error;
  }
};

const totalScoutersCount = async () => {
  try {
    const { sum } = await Patrol.query()
      .sum('numberOfScouters')
      .where({ workflowState: 'active' })
      .first();
    return parseInt(sum) || 0;
  } catch (error) {
    throw error;
  }
};

const patrolsWithThreeScouters = async () => {
  try {
    const { count } = await Patrol.query()
      .count('id')
      .where({
        workflowState: 'active',
        numberOfScouters: 3,
      })
      .first();
    return count || 0;
  } catch (error) {
    throw error;
  }
};

const totalParticipantsCount = async () => {
  try {
    const { sum } = await Patrol.query()
      .where({ workflowState: 'active' })
      .sum(raw('COALESCE(number_of_scouts,0) + COALESCE(number_of_scouters,0)'))
      .first();
    return parseInt(sum) || 0;
  } catch (error) {
    throw error;
  }
};

const totalAdventureParticipantsCount = async () => {
  try {
    const totalScouts = await totalScoutsCount();
    const totalPatrols = await totalPatrolCount();
    const patrolScouters = totalPatrols * 2;
    return patrolScouters + totalScouts;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPatrol,
  getPatrols,
  createPatrol,
  updatePatrol,
  updatePatrols,
  batchPatrols,
  totalPatrolCount,
  totalScoutsCount,
  totalScoutersCount,
  patrolsWithThreeScouters,
  totalParticipantsCount,
  totalAdventureParticipantsCount,
};
