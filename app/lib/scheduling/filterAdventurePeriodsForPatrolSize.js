const filterAdventurePeriodsForPatrolSize = async (periods, patrolSize) => {
  const periodsWithCapacity = [];
  for (const period of periods) {
    const assigned = await period.participantsAssigned();
    if (assigned.total <= patrolSize) {
      periodsWithCapacity.push(period);
    }
  }
  return periodsWithCapacity;
};

module.exports = filterAdventurePeriodsForPatrolSize;
