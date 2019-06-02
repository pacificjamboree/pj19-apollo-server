const { Adventure, AdventurePeriod, Patrol } = require('../../../models');
const vacantPeriodsForPatrol = require('../vacantPeriodsForPatrol');
const arrayContainsArray = require('../../arrayContainsArray');

const {
  seedFullDayAdventurePeriods,
  seedHalfDayAdventurePeriods,
  seedArcheryAndStemPeriods,
  seedFencingAndStemPeriods,
} = require('../../../../scripts/seedPeriods');

const {
  resetBefore,
  resetAfter,
  destroyDbConnection,
} = require('../../../../test_helpers/resetDb');

const fakePatrol = {
  patrolNumber: '123',
  groupName: '1st Test Patrol',
  patrolName: 'Fuzzy Bunnies',
  numberOfScouts: 8,
  numberOfScouters: 2,
  workflowState: 'active',
};

const fakeAdventures = [
  {
    adventureCode: 'free',
    name: 'Free',
    themeName: 'Free',
    capacityPerPeriod: 350,
    periodsOffered: 11,
    periodsRequired: 1,
    location: 'onsite',
    premiumAdventure: false,
    hidden: false,
    workflowState: 'active',
  },
  {
    adventureCode: 'sup',
    name: 'SUP',
    themeName: 'SUP',
    capacityPerPeriod: 65,
    periodsOffered: 11,
    periodsRequired: 1,
    location: 'onsite',
    premiumAdventure: false,
    hidden: false,
    workflowState: 'active',
  },
  {
    adventureCode: 'wild_play',
    name: 'Wild Play',
    themeName: 'Wild Play',
    capacityPerPeriod: 80,
    periodsOffered: 11,
    periodsRequired: 1,
    location: 'offsite',
    premiumAdventure: false,
    hidden: false,
    workflowState: 'active',
  },
  {
    adventureCode: 'kayaking',
    name: 'Kayaking',
    themeName: 'Kayaking',
    capacityPerPeriod: 80,
    periodsOffered: 11,
    periodsRequired: 1,
    location: 'offsite',
    premiumAdventure: false,
    hidden: false,
    workflowState: 'active',
  },

  {
    adventureCode: 'victoria',
    name: 'Explore Victoria',
    themeName: 'Explore Victoria',
    capacityPerPeriod: 160,
    periodsOffered: 5,
    periodsRequired: 2,
    location: 'offsite',
    premiumAdventure: false,
    hidden: false,
    workflowState: 'active',
  },
  {
    adventureCode: 'archery',
    name: 'Archery',
    themeName: 'Archery',
    capacityPerPeriod: 13,
    periodsOffered: 11,
    periodsRequired: 1,
    location: 'onsite',
    premiumAdventure: false,
    hidden: false,
    workflowState: 'active',
  },
  {
    adventureCode: 'stem_escape_room',
    name: 'Escape Room',
    themeName: 'Escape Room',
    capacityPerPeriod: 13,
    periodsOffered: 11,
    periodsRequired: 1,
    location: 'onsite',
    premiumAdventure: false,
    hidden: false,
    workflowState: 'active',
  },
  {
    adventureCode: 'stem_moon',
    name: 'Moon',
    themeName: 'Moon',
    capacityPerPeriod: 13,
    periodsOffered: 11,
    periodsRequired: 1,
    location: 'onsite',
    premiumAdventure: false,
    hidden: false,
    workflowState: 'active',
  },
  {
    adventureCode: 'fencing',
    name: 'Fencing',
    themeName: 'Fencing',
    capacityPerPeriod: 13,
    periodsOffered: 11,
    periodsRequired: 1,
    location: 'onsite',
    premiumAdventure: false,
    hidden: false,
    workflowState: 'active',
  },
  {
    adventureCode: 'stem_ar_vr',
    name: 'AR-VR',
    themeName: 'AR-VR',
    capacityPerPeriod: 13,
    periodsOffered: 11,
    periodsRequired: 1,
    location: 'onsite',
    premiumAdventure: false,
    hidden: false,
    workflowState: 'active',
  },
  {
    adventureCode: 'stem_spheros',
    name: 'Spheros',
    themeName: 'Spheros',
    capacityPerPeriod: 13,
    periodsOffered: 11,
    periodsRequired: 1,
    location: 'onsite',
    premiumAdventure: false,
    hidden: false,
    workflowState: 'active',
  },
];

const commonBeforeAll = async () => {
  await resetBefore();

  const patrol = await Patrol.query()
    .insert(fakePatrol)
    .returning('*');

  const adventures = await Adventure.query()
    .insert(fakeAdventures)
    .returning('*');

  await seedHalfDayAdventurePeriods();
  await seedFullDayAdventurePeriods();
  await seedArcheryAndStemPeriods();
  await seedFencingAndStemPeriods();
  return [patrol, adventures];
};

describe('patrol schedule empty', () => {
  let patrol;
  let adventures;
  beforeAll(async () => {
    [patrol, adventures] = await commonBeforeAll();
  });
  afterAll(async () => {
    await resetAfter();
  });

  test('returns 11 vacant periods', async () => {
    const result = await vacantPeriodsForPatrol(patrol);
    expect(result).toHaveLength(11);
  });
});

describe('patrol schedule full', () => {
  let patrol;
  let adventures;
  beforeAll(async () => {
    [patrol, adventures] = await commonBeforeAll();
    // add 11 free periods for simplicity
    // sucks to be this patrol
    const free = adventures.find(a => a.adventureCode === 'free');
    const freePeriods = await free.$relatedQuery('periods');
    const promises = freePeriods.map(p =>
      patrol.$relatedQuery('schedule').relate(p.id)
    );
    await Promise.all(promises);
  });
  afterAll(async () => {
    await resetAfter();
  });

  test('returns 0 vacant periods', async () => {
    const result = await vacantPeriodsForPatrol(patrol);
    expect(result).toHaveLength(0);
  });
});

describe('patrol schedule with some assigned, some empty', () => {
  let patrol;
  let adventures;
  beforeAll(async () => {
    [patrol, adventures] = await commonBeforeAll();
    const periodIds = [];

    const free = adventures.find(a => a.adventureCode === 'free');
    const freePeriod = await free
      .$relatedQuery('periods')
      .where({ startAt: new Date(2019, 6, 7, 14, 0) })
      .first();
    periodIds.push(freePeriod.id);

    const archery = adventures.find(a => a.adventureCode === 'archery');
    const archeryPeriod = await archery
      .$relatedQuery('periods')
      .where({ startAt: new Date(2019, 6, 8, 8, 30) })
      .first();
    periodIds.push(archeryPeriod.id);
    archeryPeriod.assignWith.forEach(p => periodIds.push(p));

    const kayaking = adventures.find(a => a.adventureCode === 'kayaking');
    const kayakingPeriod = await kayaking
      .$relatedQuery('periods')
      .where({ startAt: new Date(2019, 6, 8, 14, 0) })
      .first();
    periodIds.push(kayakingPeriod.id);

    const victoria = adventures.find(a => a.adventureCode === 'victoria');
    const victoriaPeriod = await victoria
      .$relatedQuery('periods')
      .where({ startAt: new Date(2019, 6, 9, 8, 30) })
      .first();
    periodIds.push(victoriaPeriod.id);
    victoriaPeriod.childPeriods.forEach(p => periodIds.push(p));

    const sup = adventures.find(a => a.adventureCode === 'sup');
    const supPeriod = await sup
      .$relatedQuery('periods')
      .where({ startAt: new Date(2019, 6, 10, 8, 30) })
      .first();
    periodIds.push(supPeriod.id);

    const fencing = adventures.find(a => a.adventureCode === 'fencing');
    const fencingPeriod = await fencing
      .$relatedQuery('periods')
      .where({ startAt: new Date(2019, 6, 11, 14, 0) })
      .first();
    periodIds.push(fencingPeriod.id);
    fencingPeriod.assignWith.forEach(p => periodIds.push(p));

    const wildPlay = adventures.find(a => a.adventureCode === 'wild_play');
    const wildPlayPeriod = await wildPlay
      .$relatedQuery('periods')
      .where({
        startAt: new Date(2019, 6, 12, 14, 0),
      })
      .first();
    periodIds.push(wildPlayPeriod.id);

    const promises = periodIds.map(p =>
      patrol.$relatedQuery('schedule').relate(p)
    );
    await Promise.all(promises);
  });
  afterAll(async () => {
    await resetAfter();
  });

  test('returns 3 vacant periods', async () => {
    const result = await vacantPeriodsForPatrol(patrol);
    expect(result).toHaveLength(3);
  });

  test('returns the expected periods', async () => {
    const expected = [
      new Date(2019, 6, 10, 14, 0).getTime(),
      new Date(2019, 6, 11, 8, 30).getTime(),
      new Date(2019, 6, 12, 8, 30).getTime(),
    ];
    const periods = await vacantPeriodsForPatrol(patrol);
    const periodsTs = periods.map(x => x.startAt.getTime());
    expect(arrayContainsArray(periodsTs, expected)).toBeTruthy();
  });
});

afterAll(() => {
  destroyDbConnection();
});
