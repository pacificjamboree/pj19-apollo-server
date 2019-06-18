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

const scheduleIncludesAdventureById = (schedule, adventureId) => {
  const idx = schedule.findIndex(p => p.adventureId === adventureId);
  return idx >= 0;
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

const createScheduleForPatrol = async (
  patrol,
  { assignMandatory = true, maxPremium = 1, assignFree = true }
) => {
  debug(
    'Creating schedule for patrol %s, (%s)',
    patrol.patrolNumber,
    patrol.id
  );
  try {
    const freePeriod = await Adventure.query()
      .where({ adventureCode: 'free' })
      .first();

    const free1 = await Adventure.query()
      .where({ adventureCode: 'free1' })
      .first();

    // get patrol's selection (array of adventure IDs)
    const selection = await patrol.$relatedQuery('adventureSelection');
    const { selectionOrder } = selection;
    const wantExtraFreePeriod = true;

    // get patrol's current schedule
    let patrolSchedule = await patrol.$relatedQuery('schedule');
    let currentHoursAssigned = await patrol.hoursScheduled();

    // return if patrol is fully scheduled
    // shouldn't happen because we just wiped their schedule
    if (currentHoursAssigned === TOTAL_HOURS) {
      return patrolSchedule;
    }

    const wantFreeHours = wantExtraFreePeriod ? 6 : 3;
    const MAX_POTENTIAL_HOURS = TOTAL_HOURS - wantFreeHours;

    debug(`Need to schedule ${MAX_POTENTIAL_HOURS} hours for patrol`);
    debug(`Current hours assigned: ${currentHoursAssigned}`);

    if (assignMandatory) {
      // assign everyone to fun_zone, obstacle course, waterfront
      const mandatory = await Adventure.query().whereIn('adventureCode', [
        'fun_zone',
        'obstacle_course',
        'waterfront',
      ]);
      for (const adventure of mandatory) {
        debug(
          `Searching for period for mandatory adventure ${
            adventure.adventureCode
          }`
        );
        const period = await findPeriodForAdventure(
          adventure,
          patrol,
          'RANDOM'
        );
        if (period) {
          // assign period to patrol
          debug(
            `Found period for adventure ${
              adventure.adventureCode
            }, adding to patrol schedule`
          );
          await assignPeriodToPatrolSchedule(period, patrol);
        } else {
          debug(
            `No available period for adventure ${adventure.adventureCode} :(`
          );
          continue;
        }
      }

      // update the patrol schedule and hours
      patrolSchedule = await patrol.$relatedQuery('schedule');
      currentHoursAssigned = await patrol.hoursScheduled();

      const timeLeftInSchedule = MAX_POTENTIAL_HOURS - currentHoursAssigned;
      debug(
        `End mandatory assignment, patrol has ${timeLeftInSchedule} hours left to assign`
      );
    }

    // loop over selectionOrder
    debug('Starting first loop over adventure selection');
    await adventureSelectionLoop(
      patrol,
      selectionOrder,
      MAX_POTENTIAL_HOURS,
      maxPremium
    );
    debug('Finished first loop over adventure selection');

    patrolSchedule = await patrol.$relatedQuery('schedule');

    if (assignFree) {
      // assign first free period
      // check if they have a free period already assigned (e.g. after JDF trail)
      // or if they got oceanwise, which has free periods
      const hasFreePeriod =
        scheduleIncludesAdventureById(patrolSchedule, freePeriod.id) ||
        scheduleIncludesAdventureById(patrolSchedule, free1.id);

      debug('Has free period?', hasFreePeriod);
      if (hasFreePeriod) {
        debug('Patrol already has first free period assigned; skipping');
      } else {
        debug('Finding first free period for patrol');
        const fp1 = await findPeriodForAdventure(freePeriod, patrol, 'RANDOM');
        if (!fp1) {
          debug('Got undefined for fp1');
        } else {
          await assignPeriodToPatrolSchedule(fp1, patrol);
        }
      }

      // if wantsExtraFreePeriod, giver
      if (wantExtraFreePeriod) {
        debug('Finding second free period for patrol');
        const fp2 = await findPeriodForAdventure(freePeriod, patrol, 'RANDOM');
        if (fp2) {
          await assignPeriodToPatrolSchedule(fp2, patrol);
        } else {
          debug('None found');
        }
      }
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

    return {
      schedule: patrolSchedule,
      hoursAssigned: currentHoursAssigned,
      fullyScheduled: currentHoursAssigned === TOTAL_HOURS,
    };
  } catch (error) {
    throw error;
  }
};

////// ADVENTURE SELECTION LOOP
const adventureSelectionLoop = async (
  patrol,
  selectionOrder,
  hoursToAssign,
  MAX_PREMIUM = 1
) => {
  let patrolSchedule = await patrol.$relatedQuery('schedule');
  let currentHoursAssigned = await patrol.hoursScheduled();
  let hasPermiumAdventure = 0;

  // need these for later checks
  const jdfTrail = await Adventure.query()
    .where({ adventureCode: 'jdf_trail' })
    .first();
  const oceanwise = await Adventure.query()
    .where({ adventureCode: 'stem_oceanwise' })
    .first();

  for (const id of selectionOrder) {
    // get the Adventure for the selection
    const adventure = await Adventure.query()
      .where({
        id,
      })
      .first();

    debug(`Adventure: ${adventure.adventureCode}`);

    // if schedule contains adventure, continue
    if (scheduleIncludesAdventureById(patrolSchedule, id)) {
      debug('Patrol schedule contains adventure, continuing to next adventure');
      continue;
    }

    // if it is premium, and hasPremiumActivity, continue
    const { premiumAdventure } = adventure;
    if (premiumAdventure && hasPermiumAdventure === MAX_PREMIUM) {
      debug(
        'Adventure is premium and patrol already has MAX_PREMIUM, continuing to next adventure'
      );
      continue;
    }

    // if patrol does not have time left for this adventure, continue
    debug('Checking if patrol has time for adventure', adventure.adventureCode);
    const timeLeftInSchedule = hoursToAssign - currentHoursAssigned;
    debug(`Patrol has ${timeLeftInSchedule} hours left to assign`);
    if (timeLeftInSchedule < adventure.periodsRequired * 3) {
      debug('No time left for adventure, continuing to next adventure');
      continue;
    }

    // find an adventure period for this adventure and patrol
    debug('Searching for period for adventure');
    const period = await findPeriodForAdventure(adventure, patrol, 'RANDOM');
    if (period) {
      // assign period to patrol
      debug(
        `Found period for adventure ${
          adventure.adventureCode
        }, adding to patrol schedule`
      );
      await assignPeriodToPatrolSchedule(period, patrol);
      if (premiumAdventure) {
        hasPermiumAdventure += 1;
      }
    } else {
      debug(`No available period for adventure ${adventure.adventureCode} :(`);
      continue;
    }

    // update the patrol schedule and hours
    patrolSchedule = await patrol.$relatedQuery('schedule');
    currentHoursAssigned = await patrol.hoursScheduled();

    debug(`Current hours assigned: ${currentHoursAssigned}`);

    // if schedule includes jdf, subtract three from currentHoursAssigned to handle the included FP
    if (scheduleIncludesAdventureById(patrolSchedule, jdfTrail.id)) {
      debug(`Has JDF Trail, adjusting current hours assigned`);
      currentHoursAssigned -= 3;
      debug(`Current hours assigned: ${currentHoursAssigned}`);
    }

    // if schedule includes oceanwise, subtract three from currentHoursAssigned to handle the included FP
    if (scheduleIncludesAdventureById(patrolSchedule, oceanwise.id)) {
      debug(`Has Oceanwise, adjusting current hours assigned`);
      currentHoursAssigned -= 3;
      debug(`Current hours assigned: ${currentHoursAssigned}`);
    }

    if (currentHoursAssigned === hoursToAssign) {
      debug('Patrol has reached MAX_POTENTIAL_HOURS, breaking out of loop now');
      break;
    }
  }
};

module.exports = createScheduleForPatrol;
