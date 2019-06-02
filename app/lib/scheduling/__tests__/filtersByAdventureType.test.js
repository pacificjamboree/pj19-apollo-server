const { Patrol, Adventure, AdventurePeriod } = require('../../../models');
const vacantPeriodsForPatrol = require('../vacantPeriodsForPatrol');
const arrayContainsArray = require('../../arrayContainsArray');
const {
  halfDayOnSite,
  halfDayOffSite,
  fullDay,
  overnight,
} = require('../filtersByAdventureType');

const {
  seedFullDayAdventurePeriods,
  seedHalfDayAdventurePeriods,
  seedJdfAdventurePeriods,
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
    adventureCode: 'kayaking',
    name: 'Kayaking',
    themeName: 'Kayaking',
    capacityPerPeriod: 35,
    periodsOffered: 11,
    periodsRequired: 1,
    location: 'offsite',
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
    adventureCode: 'jdf_trail',
    name: 'Juan de Fuca Trail',
    themeName: 'Juan de Fuca Trail',
    capacityPerPeriod: 40,
    periodsOffered: 3,
    periodsRequired: 3,
    location: 'offsite',
    premiumAdventure: false,
    hidden: false,
    workflowState: 'active',
  },
];

describe('half-day on-site', () => {
  let patrol;
  let adventures;
  let period;
  let vacantPeriods;
  beforeAll(async () => {
    await resetBefore();

    patrol = await Patrol.query()
      .insert(fakePatrol)
      .returning('*');

    adventures = await Adventure.query()
      .insert(fakeAdventures)
      .returning('*');

    await seedHalfDayAdventurePeriods();
    await seedFullDayAdventurePeriods();
    await seedJdfAdventurePeriods();

    const kayaking = adventures.find(a => (a.adventureCode = 'kayaking'));
    const kayakingPeriods = await kayaking.$relatedQuery('periods');
    period =
      kayakingPeriods[Math.floor(Math.random() * kayakingPeriods.length)];
    await patrol.$relatedQuery('schedule').relate(period.id);
    vacantPeriods = await vacantPeriodsForPatrol(patrol);
  });

  afterAll(async () => {
    await resetAfter();
  });

  test('returns 10 potential periods', async () => {
    const result = halfDayOnSite(vacantPeriods);
    expect(result).toHaveLength(10);
  });

  test('there is no conflict with existing scheduled periods', async () => {
    const result = halfDayOnSite(vacantPeriods);
    expect(result.map(x => x.startAt.getTime())).not.toContain(
      period.startAt.getTime()
    );
  });
});

describe('half-day off-site', () => {
  let patrol;
  let adventures;
  let period;
  let vacantPeriods;

  beforeAll(async () => {
    patrol = await Patrol.query()
      .insert(fakePatrol)
      .returning('*');

    adventures = await Adventure.query()
      .insert(fakeAdventures)
      .returning('*');

    await seedHalfDayAdventurePeriods();
    await seedFullDayAdventurePeriods();
    await seedJdfAdventurePeriods();

    const kayaking = adventures.find(a => (a.adventureCode = 'kayaking'));
    const kayakingPeriods = await kayaking
      .$relatedQuery('periods')
      .orderBy('startAt');
    // pick the monday morning period
    period = kayakingPeriods.find(
      p => p.startAt.getTime() === new Date(2019, 6, 8, 8, 30).getTime()
    );

    await patrol.$relatedQuery('schedule').relate(period.id);
    vacantPeriods = await vacantPeriodsForPatrol(patrol);
  });

  afterAll(async () => {
    await resetAfter();
  });

  test('returns 9 potential periods', async () => {
    // there should be nine potential periods returned
    // 11 total - 1 assigned = 10 - 1 ineligible = 9 potential
    const schedule = await patrol.$relatedQuery('schedule');
    const result = halfDayOffSite(vacantPeriods, schedule);
    expect(result).toHaveLength(9);
  });

  test('there is no conflict with existing scheduled periods', async () => {
    const schedule = await patrol.$relatedQuery('schedule');
    const result = halfDayOffSite(vacantPeriods, schedule);
    expect(result.map(x => x.startAt.getTime())).not.toContain(
      period.startAt.getTime()
    );
  });

  test('it does not pick the period immediately adjacent to the already scheduled off-site', async () => {
    // kayaking has been scheduled for monday morning
    const schedule = await patrol.$relatedQuery('schedule');
    const result = halfDayOffSite(vacantPeriods, schedule);
    // we should not see monday afternoon in the list
    const mondayAfternoon = new Date(2019, 6, 8, 14, 0).getTime();
    expect(result.map(x => x.startAt.getTime())).not.toContain(mondayAfternoon);
  });
});

describe('full-day', () => {
  let patrol;
  let adventures;
  let kayakingPeriod, supPeriod, wildplayPeriod;
  let vacantPeriods;

  beforeAll(async () => {
    patrol = await Patrol.query()
      .insert(fakePatrol)
      .returning('*');

    adventures = await Adventure.query()
      .insert(fakeAdventures)
      .returning('*');

    await seedHalfDayAdventurePeriods();
    await seedFullDayAdventurePeriods();
    await seedJdfAdventurePeriods();

    // add a kayaking period to the schedule on monday morning
    const kayaking = adventures.find(a => (a.adventureCode = 'kayaking'));
    const kayakingPeriods = await kayaking
      .$relatedQuery('periods')
      .orderBy('startAt');
    kayakingPeriod = kayakingPeriods.find(
      p => p.startAt.getTime() === new Date(2019, 6, 8, 8, 30).getTime()
    );
    await patrol.$relatedQuery('schedule').relate(kayakingPeriod.id);

    // add a sup period on wednesday afternoon
    const sup = adventures.find(a => (a.adventureCode = 'sup'));
    const supPeriods = await sup.$relatedQuery('periods').orderBy('startAt');
    supPeriod = supPeriods.find(
      p => p.startAt.getTime() === new Date(2019, 6, 10, 14, 0).getTime()
    );
    await patrol.$relatedQuery('schedule').relate(supPeriod.id);

    // add a wild play period on friday morning
    const wildPlay = adventures.find(a => (a.adventureCode = 'wild_play'));
    const wildPlayPeriods = await wildPlay
      .$relatedQuery('periods')
      .orderBy('startAt');
    wildplayPeriod = wildPlayPeriods.find(
      p => p.startAt.getTime() === new Date(2019, 6, 12, 8, 30).getTime()
    );
    await patrol.$relatedQuery('schedule').relate(wildplayPeriod.id);

    vacantPeriods = await vacantPeriodsForPatrol(patrol);
  });
  afterAll(async () => {
    await resetAfter();
  });

  test('returns 2 potential periods', async () => {
    const result = fullDay(vacantPeriods);
    expect(result).toHaveLength(2);
  });

  test('returns the right periods', async () => {
    /**
     * We have pre-booked periods on monday morning,
     * wednesday afternoon, and friday morning. Therefore,
     * the only availalbe full days are Tuesday and Thursday.
     * We only get the morning period, so the array should
     * only contain the periods for Tuesday and Thursday morning.
     */

    const validDates = [
      new Date(2019, 6, 9, 8, 30).getTime(),
      new Date(2019, 6, 11, 8, 30).getTime(),
    ];

    const potentialDates = fullDay(vacantPeriods).map(x => x.startAt.getTime());
    expect(arrayContainsArray(potentialDates, validDates)).toBeTruthy();
  });
});

describe('overnight', () => {
  let patrol;
  let adventures;
  let kayakingPeriod, supPeriod, wildplayPeriod;
  let vacantPeriods;
  beforeAll(async () => {
    patrol = await Patrol.query()
      .insert(fakePatrol)
      .returning('*');

    adventures = await Adventure.query()
      .insert(fakeAdventures)
      .returning('*');

    await seedHalfDayAdventurePeriods();
    await seedFullDayAdventurePeriods();
    await seedJdfAdventurePeriods();

    // add a kayaking period to the schedule on monday morning
    const kayaking = adventures.find(a => (a.adventureCode = 'kayaking'));
    const kayakingPeriods = await kayaking
      .$relatedQuery('periods')
      .orderBy('startAt');
    kayakingPeriod = kayakingPeriods.find(
      p => p.startAt.getTime() === new Date(2019, 6, 8, 8, 30).getTime()
    );
    await patrol.$relatedQuery('schedule').relate(kayakingPeriod.id);

    // add a sup period on wednesday afternoon
    const sup = adventures.find(a => (a.adventureCode = 'sup'));
    const supPeriods = await sup.$relatedQuery('periods').orderBy('startAt');
    supPeriod = supPeriods.find(
      p => p.startAt.getTime() === new Date(2019, 6, 10, 14, 0).getTime()
    );
    await patrol.$relatedQuery('schedule').relate(supPeriod.id);

    // add a wild play period on sunday afternoon
    const wildPlay = adventures.find(a => (a.adventureCode = 'wild_play'));
    const wildPlayPeriods = await wildPlay
      .$relatedQuery('periods')
      .orderBy('startAt');
    wildplayPeriod = wildPlayPeriods.find(
      p => p.startAt.getTime() === new Date(2019, 6, 7, 14, 0).getTime()
    );
    await patrol.$relatedQuery('schedule').relate(wildplayPeriod.id);

    vacantPeriods = await vacantPeriodsForPatrol(patrol);
  });
  afterAll(async () => {
    await resetAfter();
  });

  test('returns 1 potential period', async () => {
    const result = overnight(vacantPeriods);
    expect(result).toHaveLength(1);
  });

  test('returns the expected period', async () => {
    const result = overnight(vacantPeriods);
    expect(result[0].startAt.getTime()).toBe(
      new Date(2019, 6, 11, 8, 30).getTime()
    );
  });
});

afterAll(() => {
  destroyDbConnection();
});
