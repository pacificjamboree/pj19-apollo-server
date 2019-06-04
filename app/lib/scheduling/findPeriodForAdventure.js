const vacantPeriodsForPatrol = require('./vacantPeriodsForPatrol');
const {
  halfDayOffSite,
  halfDayOnSite,
  fullDay,
  overnight,
} = require('./filtersByAdventureType');
const filterAdventurePeriodsForPatrolSize = require('./filterAdventurePeriodsForPatrolSize');
const periodPickers = require('./periodPickers');

/**
 * Selects an AdventurePeriod with enough available capacity for a patrol of a given size
 *
 * @param {Adventure} adventure - an instance of an Adventure
 * @param {Patrol} patrol - the subject Patrol
 * @param {string=RANDOM} how - determins which algorithm to use when selecting the AdventurePeriod
 *
 * @returns {AdventurePeriod}
 */
const findPeriodForAdventure = async (adventure, patrol, how = 'RANDOM') => {
  try {
    const { periodsRequired, location } = adventure;
    const schedule = await patrol.$relatedQuery('schedule');
    const periods = await adventure.$relatedQuery('periods');
    // get vacant periods for the patrol
    const vacant = await vacantPeriodsForPatrol(patrol);
    const vacantAdventurePeriods = vacant.map(p =>
      periods.find(pp => pp.startAt.getTime() === p.startAt.getTime())
    );

    // get all available periods for this type of adventure
    let potentialPeriods = [];
    switch (periodsRequired) {
      case 1:
        potentialPeriods =
          location === 'onsite'
            ? await halfDayOnSite(vacantAdventurePeriods)
            : await halfDayOffSite(vacantAdventurePeriods, schedule);
        break;

      case 2:
        potentialPeriods = await fullDay(vacantAdventurePeriods);
        break;

      case 3:
        potentialPeriods = await overnight(vacantAdventurePeriods);
        break;

      default:
        break;
    }

    // narrow down the list to periods that fit the patrol
    const size = patrol.totalUnitSize();
    const periodsThatFitPatrol = await filterAdventurePeriodsForPatrolSize(
      potentialPeriods,
      size
    );
    const period = await periodPickers[how](periodsThatFitPatrol);
    return period;
  } catch (error) {
    throw error;
  }
};

module.exports = findPeriodForAdventure;
