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
const halfDayOffSite = (potentialPeriods, schedule) => {
  // loop over `potentialPeriods`
  // for each period, determine if it is morning or afternoon
  // find `adjacent` period
  //   morning: afternoon
  //   afternoon: morning
  // if no adjacent period exists, then nothing is schedule and it is viable
  // if adjacent period exists
  //   check if adjacent period is on-site
  //   if yes, consider it viable and add to the list

  return potentialPeriods.filter(period => {
    const { startAt } = period;
    const dayOfWeek = startAt.getDate();
    const morningPeriod = isMorningPeriod(period);
    const adjacentStartAt = morningPeriod
      ? new Date(2019, 6, dayOfWeek, 14, 0)
      : new Date(2019, 6, dayOfWeek, 8, 30);
    const adjacentPeriod = schedule.find(p =>
      isSameDate(p.startAt, adjacentStartAt)
    );

    if (!adjacentPeriod) return true;

    const { location } = adjacentPeriod;
    return location === 'onsite';
  });
};

// Full-Day: needs free morning and afternoon in the same day
const fullDay = potentialPeriods => {
  // get all the morning periods
  // loop over the morning periods
  // is there a corresponding afternoon period in the same day?
  // if yes, return the morning period
  // DO NOT RETURN AFTERNOON PERIODS
  //   these are handled by the childPeriods attribute on the AdventurePeriod

  return potentialPeriods.filter(period => {
    if (!isMorningPeriod(period)) return false;

    const dayOfWeek = period.startAt.getDate();
    const adjacentAfternoonStartAt = new Date(2019, 6, dayOfWeek, 14, 0);
    return potentialPeriods.find(p =>
      isSameDate(p.startAt, adjacentAfternoonStartAt)
    );
  });
};

// JDF Trail: needs free morning and afternoon in the same day
// two days in a row
const overnight = (potentialPeriods, schedule) => {
  // get all the morning periods monday - thursday
  // are there corresponding periods in the
  //  afternoon the same day,
  //  morning next day,
  //  afternoon next day?
  // if yes, return the inital morning period
  // DO NOT RETURN AFTERNOON PERIODS
  //  these are handled by the childPeriods attribute on the AdventurePeriod

  const potentialPeriodsTs = potentialPeriods.map(({ startAt }) =>
    startAt.getTime()
  );

  return potentialPeriods.filter(period => {
    const { startAt } = period;
    if (!isMorningPeriod(period)) return false;
    if (startAt.getDay() === 5) return false;

    const dayOfWeek = period.startAt.getDate();
    const nextDayOfWeek = dayOfWeek + 1;
    const adjacentPeriodStartAt = [
      new Date(2019, 6, dayOfWeek, 14, 0).getTime(),
      new Date(2019, 6, nextDayOfWeek, 8, 30).getTime(),
      new Date(2019, 6, nextDayOfWeek, 14, 0).getTime(),
    ];
    return arrayContainsArray(potentialPeriodsTs, adjacentPeriodStartAt);
  });
};

module.exports = {
  halfDayOnSite,
  halfDayOffSite,
  fullDay,
  overnight,
};
