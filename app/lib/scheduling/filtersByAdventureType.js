/**
 * filtersByAdventureType
 * Takes periods as input and returns periods that match
 * certain criteria for each class of Adventure
 *
 * `periods` represents the unassigned periods on a patrol schedule
 * `schedule` represents the patrol's current schedule of periods
 */

const arrayContainsArray = require('../arrayContainsArray');
const isSameDate = (a, b) => a.getTime() === b.getTime();
const isMorningPeriod = period => period.startAt.getHours() < 12;

// Half-Day On-Site: no restrictions, return all periods
const halfDayOnSite = potentialPeriods => potentialPeriods;

// Half-Day Off-Site: can't be adjacent to another off-site in the same day
const halfDayOffSite = async (potentialPeriods, schedule) => {
  // loop over `potentialPeriods`
  // for each period, determine if it is morning or afternoon
  // find `adjacent` period
  //   morning: afternoon
  //   afternoon: morning
  // if no adjacent period exists, then nothing is schedule and it is viable
  // if adjacent period exists
  //   check if adjacent period is on-site
  //   if yes, consider it viable and add to the list
  const returnable = [];
  for (const period of potentialPeriods) {
    const { startAt } = period;
    const dayOfWeek = startAt.getDate();
    const morningPeriod = isMorningPeriod(period);
    const adjacentStartAt = morningPeriod
      ? new Date(2019, 6, dayOfWeek, 14, 0)
      : new Date(2019, 6, dayOfWeek, 8, 30);
    const adjacentPeriod = schedule.find(p =>
      isSameDate(p.startAt, adjacentStartAt)
    );

    if (!adjacentPeriod) {
      returnable.push(period);
    } else {
      const adjacentAdventure = await adjacentPeriod.$relatedQuery('adventure');
      const { location } = adjacentAdventure;
      if (location === 'onsite') {
        returnable.push(period);
      }
    }
  }
  return returnable;
};

// Full-Day: Receives the morning period; patrol needs to have the afternoon period unassigned
const fullDay = (potentialPeriods, schedule) => {
  const returnable = [];
  for (const period of potentialPeriods) {
    // get the day in which the period exits
    const day = period.startAt.getDate();
    const afternoonStartAt = new Date(2019, 6, day, 14, 0);
    const scheduledForAfternoonBlock = schedule.find(
      p => p.startAt.getTime() === afternoonStartAt.getTime()
    );
    if (!scheduledForAfternoonBlock) {
      returnable.push(period);
    }
  }
  return returnable;
};

// JDF Trail: Receives the morning period; patrol needs free morning and afternoon in the same day
// two days in a row
const overnight = (potentialPeriods, schedule) => {
  const scheduleDates = schedule.map(p => p.startAt.getTime());
  const returnable = [];
  for (const period of potentialPeriods) {
    // get the day in which the period exits
    const day = period.startAt.getDate();
    // and the next day
    const nextDay = day + 1;

    const mustHaveFree = [
      new Date(2019, 6, day, 14, 0).getTime(),
      new Date(2019, 6, nextDay, 8, 30).getTime(),
      new Date(2019, 6, nextDay, 14, 0).getTime(),
    ];

    if (!scheduleDates.some(r => mustHaveFree.includes(r))) {
      returnable.push(period);
    }
  }
  return returnable;
};

module.exports = {
  halfDayOnSite,
  halfDayOffSite,
  fullDay,
  overnight,
};
