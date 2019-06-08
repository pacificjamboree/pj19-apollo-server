const debug = require('debug')('scheduling:vacantPeriodsForPatrol');
const diffHours = require('date-fns/difference_in_hours');

const blocks = () => {
  const amDays = [8, 9, 10, 11, 12];
  const pmDays = [7, ...amDays];

  const amPeriods = amDays.map(d => ({
    startAt: new Date(2019, 6, d, 8, 30),
    endAt: new Date(2019, 6, d, 11, 30),
  }));

  const pmPeriods = pmDays.map(d => ({
    startAt: new Date(2019, 6, d, 14, 0),
    endAt: new Date(2019, 6, d, 17, 0),
  }));

  return [...amPeriods, ...pmPeriods].sort(
    (a, b) => a.startAt.getTime() - b.startAt.getTime()
  );
};

module.exports = async patrol => {
  // get the patrol's current schedule from DB
  const schedule = await patrol.$relatedQuery('schedule');

  // normalize the schedule so that we have even three hour blocks (e.g. reduce the fencing/archery/stem groupings)
  const normalizedSchedule = schedule
    .map(period => {
      const periodDuration = diffHours(period.endAt, period.startAt);
      if (periodDuration === 3) {
        debug('period is three hours, returning period');
        return period;
      }

      if (periodDuration < 3 && !period.assignWith.length) {
        debug('period is less than 3 hours and has no assignWith');
        return null;
      } else {
        debug(
          'period is less than three hours and has assignWith; returning a dummy'
        );
        if (period.startAt.getHours() < 12) {
          // morning
          return {
            startAt: new Date(2019, 6, period.startAt.getDate(), 8, 30),
            endAt: new Date(2019, 6, period.endAt.getDate(), 11, 30),
          };
        } else {
          // afternoon
          return {
            startAt: new Date(2019, 6, period.startAt.getDate(), 14, 0),
            endAt: new Date(2019, 6, period.startAt.getDate(), 17, 0),
          };
        }
      }
    })
    .filter(Boolean); // strip out nulls before returning
  // debug({ normalizedSchedule });
  // make a list of vacant blocks in schedule
  const allBlocks = blocks();
  // debug({ allBlocks });
  const vacantBlocks = allBlocks.filter(block => {
    // debug(block.startAt);
    // return true if normalizedSchedule DOES NOT have a block with this block's startAt
    const normalizedScheduleIncludesBlock = normalizedSchedule
      .map(p => p.startAt.getTime())
      .includes(block.startAt.getTime());
    // debug({ normalizedScheduleIncludesBlock });
    return !normalizedScheduleIncludesBlock;
  });

  return vacantBlocks;
};
