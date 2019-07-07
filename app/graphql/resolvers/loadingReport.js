const { Adventure, AdventurePeriod } = require('../../models');

const SUNDAY = 7;
const MONDAY = 8;
const TUESDAY = 9;
const WEDNESDAY = 10;
const THURSDAY = 11;
const FRIDAY = 12;

const loadingReportByDay = async day => {
  const exclude = ['free', 'free1'];
  // select all the adventure periods with associated adventure and patrols for the day
  const periods = await AdventurePeriod.query().eager('[adventure, patrols]');
  const periodsForDay = periods.filter(
    period =>
      new Date(period.startAt).getDate() === day &&
      !exclude.includes(period.adventure.adventureCode)
  );
  const periodsForAdventures = {};
  periodsForDay.forEach(period => {
    const { adventureCode } = period.adventure;
    if (periodsForAdventures.hasOwnProperty(adventureCode)) {
      periodsForAdventures[adventureCode].push(period);
    } else {
      periodsForAdventures[adventureCode] = [period];
    }
  });
};

const adventureLoadingReportForDay = async day => {
  try {
    const exclude = ['stem', 'free', 'free1'];
    const adventures = await Adventure.query()
      .where({ workflowState: 'active', hidden: false })
      .eager('[periods.patrols]');

    const filteredAdventures = adventures.filter(
      a => !exclude.includes(a.adventureCode)
    );

    const filtered = filteredAdventures.map(adventure => {
      const periodsForDay = adventure.periods.filter(
        p => new Date(p.startAt).getDate() === day
      );
      adventure.periods = periodsForDay;
      return adventure;
    });

    return filtered;
  } catch (error) {
    throw error;
  }
};

module.exports = { adventureLoadingReportForDay };
