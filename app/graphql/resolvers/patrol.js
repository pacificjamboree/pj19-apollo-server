const { fromGlobalId } = require('graphql-relay-tools/dist/node');
const { transaction, raw } = require('objection');
const sortBy = require('lodash.sortby');
const { UnauthorizedActionError } = require('../errors');
const {
  AdventurePeriod,
  Patrol,
  PatrolScouter,
  PatrolAdventureSelection,
  User,
} = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const {
  queues: { PATROL_SCHEDULE_PDF },
} = require('../../queues');

const getPatrol = async (input, ctx) => {
  try {
    const patrol = await Patrol.query()
      .where(whereSearchField(input))
      .eager('[patrolScouter, patrolScouter.user, adventureSelection]')
      .first();

    const { roles } = ctx.user;
    if (roles.includes('admin')) return patrol;
    if (
      roles.includes('patrolScouter') &&
      ctx.user.patrolScouterId === patrol.patrolScouterId
    ) {
      return patrol;
    }
    throw new UnauthorizedActionError();
  } catch (error) {
    throw error;
  }
};

const getPatrols = async ({
  workflowState = ['active'],
  name,
  fullyPaid,
  scheduleStatus = 'any',
}) => {
  const nameFilter = (qb, name) => {
    if (name !== undefined) {
      qb.where('name', 'ilike', `%${name}%`);
    }
  };

  const fullyPaidFilter = (qb, fullyPaid) => {
    if (fullyPaid === undefined) return;
    const FIELD = 'final_payment_date';
    fullyPaid ? qb.whereNotNull(FIELD) : qb.whereNull(FIELD);
  };

  const patrols = await Patrol.query()
    .eager('[patrolScouter, patrolScouter.user, adventureSelection]')
    .whereIn('workflowState', workflowState)
    .modify(nameFilter, name)
    .modify(fullyPaidFilter, fullyPaid);

  let returnable;
  switch (scheduleStatus) {
    case 'any':
      returnable = patrols;
      break;

    case 'full':
      const fullPatrols = [];
      for (const patrol of patrols) {
        const hours = await patrol.hoursScheduled();
        if (hours === 33) fullPatrols.push(patrol);
      }
      returnable = sortBy(fullPatrols, ['finalPaymentDate', 'patrolNumber']);
      break;

    case 'notFull':
      const notFullPatrols = [];
      for (const patrol of patrols) {
        const hours = await patrol.hoursScheduled();
        if (hours !== 33) notFullPatrols.push(patrol);
      }
      returnable = sortBy(notFullPatrols, ['finalPaymentDate', 'patrolNumber']);
      break;

    default:
      return patrols;
  }
  return returnable;
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

    // welcomeEmailsToSend.forEach(to => {
    //   SEND_EMAIL.add({ type: 'PATROL_WELCOME', data: { to } });
    // });

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

const addAdventurePeriodToPatrol = async ({ adventurePeriodId, patrolId }) => {
  try {
    let patrol = await Patrol.query()
      .where({ id: fromGlobalId(patrolId).id })
      .eager('schedule')
      .first();
    if (!patrol) {
      throw new Error('no such patrol');
    }

    const apDbId = fromGlobalId(adventurePeriodId).id;
    const adventurePeriod = await AdventurePeriod.query()
      .where({ id: apDbId })
      .first();
    if (!adventurePeriod) {
      throw new Error('no such adventure period');
    }

    if (patrol.schedule.map(x => x.id).includes(apDbId)) {
      throw new Error('patrol schedule already contains period');
    }

    // collect all the period IDs to assign
    const ids = [
      adventurePeriod.id,
      ...adventurePeriod.childPeriods,
      ...adventurePeriod.assignWith,
    ];
    // assign the period(s) to the patrol
    await patrol.$relatedQuery('schedule').relate(ids);

    patrol = await patrol.$query().eager('schedule');
    PATROL_SCHEDULE_PDF.add({
      id: patrol.id,
      patrolNumber: patrol.patrolNumber,
      subcamp: patrol.subcamp,
    });
    return { patrol };
  } catch (error) {
    throw error;
  }
};

const removeAdventurePeriodFromPatrol = async ({
  adventurePeriodId,
  patrolId,
}) => {
  try {
    let patrol = await Patrol.query()
      .where({ id: fromGlobalId(patrolId).id })
      .eager('schedule')
      .first();
    if (!patrol) {
      throw new Error('no such patrol');
    }

    const apDbId = fromGlobalId(adventurePeriodId).id;
    const adventurePeriod = await AdventurePeriod.query()
      .where({ id: apDbId })
      .first();
    if (!adventurePeriod) {
      throw new Error('no such adventure period');
    }

    // if schedule doesn't include the period, return the patrol early
    if (!patrol.schedule.map(x => x.id).includes(apDbId)) {
      console.log('no such period');
      return { patrol };
    }

    // collect the IDs to remove
    // collect all the period IDs to assign
    const ids = [
      adventurePeriod.id,
      ...adventurePeriod.childPeriods,
      ...adventurePeriod.assignWith,
    ];

    // remove the period from the patrol's schedule
    await patrol
      .$relatedQuery('schedule')
      .unrelate()
      .whereIn('adventurePeriodId', ids);

    patrol = await patrol.$query().eager('schedule');
    console.log({ patrol });
    PATROL_SCHEDULE_PDF.add({
      id: patrol.id,
      patrolNumber: patrol.patrolNumber,
      subcamp: patrol.subcamp,
    });

    return { patrol };
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
  addAdventurePeriodToPatrol,
  removeAdventurePeriodFromPatrol,
};
