const filterAdventurePeriodsForPatrolSize = async (periods, patrolSize) => {
  const periodsWithCapacity = [];
  for (const period of periods) {
    const assigned = await period.participantsAssigned();
    const adventure = await period.$relatedQuery('adventure');
    const roomLeft = adventure.capacityPerPeriod - assigned.total;
    if (roomLeft >= patrolSize) {
      periodsWithCapacity.push(period);
    }
  }
  return periodsWithCapacity;
};

module.exports = filterAdventurePeriodsForPatrolSize;
