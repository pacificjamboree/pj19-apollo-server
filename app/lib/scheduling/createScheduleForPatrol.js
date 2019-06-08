const debug = require('debug')('scheduling:createScheduleForPatrol');
const { Adventure } = require('../../models');
const findPeriodForAdventure = require('./findPeriodForAdventure');
const TOTAL_HOURS = 33;

const assignPeriodToPatrolSchedule = async (period, patrol) => {
  debug(`Assigning period ${period.id}`);
  try {
    const { id, childPeriods, assignWith } = period;
    await patrol.$relatedQuery('schedule').relate(id);
    if (childPeriods.length) {
      for (const p of childPeriods) {
        debug(`Assigning child period ${p}`);
        await patrol.$relatedQuery('schedule').relate(p);
      }
    }

    if (assignWith.length) {
      for (const p of assignWith) {
        debug(`Assigning paired period ${p}`);
        await patrol.$relatedQuery('schedule').relate(p);
      }
    }
  } catch (error) {
    throw error;
  }
};

const clearPatrolSchedule = async patrol => {
  try {
    const knex = patrol.$knex();
    await knex.raw(
      `DELETE FROM patrol_schedule WHERE patrol_id = ?`,
      patrol.id
    );
  } catch (error) {
    throw error;
  }
};

/**
 * createScheduleForPatrol
 * @param {Patrol} patrol - the target patrol
 * @param {Boolean} clearFirst - if true, erase any existing patrol schedule
 *
 * Takes a patrol and generates a patrol schedule according to the
 * order of selections in their adventure selection.
 *
 * Uses the following logic to accomplish this:
 *
 * - the maximum scheduled hours is TOTAL_HOURS
 * - subtract 3 for the mandatory free period
 * - subtract another 3 if they want an extra free period
 * - this gives MAX_POTENTIAL_HOURS
 * - subtract from their total scheduled hours
 *
 * loop over their PAS selection order until scheduled hours === MAX_POTENTIAL_HOURS
 * - if schedule has activity, break
 * - if activity is premium and patrol already has one, break
 * - attempt to find a period for this activity
 *   - if one found:
 *     - schedule it (and any childPeriods or assignWith periods)
 * - update the hours counter
 * - if hours full, break
 * - else, repeat the loop until PAS is exhausterd
 *
 * - assign free period(s)
 */

const createScheduleForPatrol = async patrol => {
  debug(
    'Creating schedule for patrol %s, (%s)',
    patrol.patrolNumber,
    patrol.id
  );
  try {
    const freePeriod = await Adventure.query()
      .where({ adventureCode: 'free' })
      .first();

    // start with a clean slate
    // debug('Removing previous schedule items');
    // await clearPatrolSchedule(patrol);

    // get patrol's selection (array of adventure IDs)
    const selection = await patrol.$relatedQuery('adventureSelection');
    const { selectionOrder, wantExtraFreePeriod } = selection;

    // get patrol's current schedule
    let patrolSchedule = await patrol.$relatedQuery('schedule');
    let currentHoursAssigned = await patrol.hoursScheduled();
    let hasPermiumAdventure = false;

    // return if patrol is fully scheduled
    // shouldn't happen because we just wiped their schedule
    if (currentHoursAssigned === TOTAL_HOURS) {
      return patrolSchedule;
    }

    const wantFreeHours = wantExtraFreePeriod ? 6 : 3;
    const MAX_POTENTIAL_HOURS = TOTAL_HOURS - wantFreeHours;

    debug(`Need to schedule ${MAX_POTENTIAL_HOURS} for patrol`);
    debug(`Current hours assigned: ${currentHoursAssigned}`);

    // loop over selectionOrder
    debug('Starting loop over adventure selection');
    for (const id of selectionOrder) {
      // get the Adventure for the selection
      const adventure = await Adventure.query()
        .where({ id })
        .first();

      debug(`Adventure: ${adventure.adventureCode}`);

      // if schedule contains adventure, continue
      if (patrolSchedule.includes(id)) {
        debug(
          'Patrol schedule contains adventure, continuing to next adventure'
        );
        continue;
      }

      // if it is premium, and hasPremiumActivity, break
      const { premiumAdventure } = adventure;
      if (premiumAdventure && hasPermiumAdventure) {
        debug(
          'Adventure is premium and patrol already has premium, continuing to next adventure'
        );
        continue;
      }

      // find an adventure period for this adventure and patrol
      debug('Searching for period for adventure');
      const period = await findPeriodForAdventure(adventure, patrol);
      if (period) {
        // assign period to patrol
        debug(
          `Found period for adventure ${
            adventure.adventureCode
          }, adding to patrol schedule`
        );
        await assignPeriodToPatrolSchedule(period, patrol);
        if (premiumAdventure) {
          hasPermiumAdventure = true;
        }
      } else {
        debug(
          `No available period for adventure ${adventure.adventureCode} :(`
        );
        continue;
      }

      // update the patrol schedule and hours
      patrolSchedule = await patrol.$relatedQuery('schedule');
      currentHoursAssigned = await patrol.hoursScheduled();

      debug(`Current hours assigned: ${currentHoursAssigned}`);

      if (currentHoursAssigned === MAX_POTENTIAL_HOURS) {
        debug('Patrol has reached MAX_POTENTIAL_HOURS, breaking now');
        break;
      }
    }
    debug('Finished loop over adventure selection');

    patrolSchedule = await patrol.$relatedQuery('schedule');

    // assign first free period
    debug('Finding first free period for patrol');
    const fp1 = await findPeriodForAdventure(freePeriod, patrol);
    await assignPeriodToPatrolSchedule(fp1, patrol);

    // if wantsExtraFreePeriod, giver
    if (wantExtraFreePeriod) {
      debug('Finding second free period for patrol');
      const fp2 = await findPeriodForAdventure(freePeriod, patrol);
      await assignPeriodToPatrolSchedule(fp2, patrol);
    }

    currentHoursAssigned = await patrol.hoursScheduled();

    if (currentHoursAssigned === TOTAL_HOURS) {
      debug(`Patrol ${patrol.patrolNumber} fully scheduled`);
    } else {
      debug(
        `Patrol ${
          patrol.patrolNumber
        } not fully scheduled. Assigned hours: ${currentHoursAssigned}`
      );
    }

    return patrolSchedule;
  } catch (error) {
    throw error;
  }
};

module.exports = createScheduleForPatrol;
