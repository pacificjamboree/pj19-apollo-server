const mapBySize = async periods => {
  const mapped = [];
  for (const period of periods) {
    const participantsAssigned = await period.participantsAssigned();
    mapped.push({ id: period.id, participantsAssigned });
  }
  return mapped;
};

module.exports = {
  RANDOM: periods => periods[Math.floor(Math.random() * periods.length)],
  FIRST_IN_TIME: periods =>
    periods.sort((a, b) => a.startAt.getTime() - b.startAt.getTime())[0],
  LAST_IN_TIME: periods =>
    periods.sort((a, b) => b.startAt.getTime() - a.startAt.getTime())[0],
  MOST_SPACE_AVAILABLE: async periods => {
    const mapped = await mapBySize(periods);
    const target = mapped.sort(
      (a, b) => a.participantsAssigned > b.participantsAssigned
    )[0];
    return periods.find(p => p.id === target.id);
  },
  LEAST_SPACE_AVAILABLE: async periods => {
    const mapped = await mapBySize(periods);
    const target = mapped.sort(
      (a, b) => a.participantsAssigned < b.participantsAssigned
    )[0];
    return periods.find(p => p.id === target.id);
  },
};
