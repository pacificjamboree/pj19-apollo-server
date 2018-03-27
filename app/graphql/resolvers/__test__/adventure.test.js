const { Adventure } = require('../../../models');
const { getAdventure, getAdventures } = require('../adventure');
const {
  resetBefore,
  resetAfter,
  destroyDbConnection,
} = require('../../../../test_helpers/resetDb');

describe('getAdventure', () => {
  let fakeAdventure;
  beforeAll(async () => {
    await resetBefore();
    fakeAdventure = await Adventure.query()
      .insert({
        adventureCode: '123',
        name: 'fakeAdventure',
        themeName: 'fakeAdventure',
        capacityPerPeriod: 100,
        periodsOffered: 11,
        periodsRequired: 1,
        premiumAdventure: false,
        hidden: false,
      })
      .returning('*');
  });

  test('it returns an instance of Adventure', async () => {
    const result = await getAdventure({
      searchField: '_id',
      value: fakeAdventure.id,
    });
    expect(result).toBeInstanceOf(Adventure);
  });

  test('it works when searching by a relay gloabl ID', async () => {
    const result = await getAdventure({
      searchField: 'id',
      value: fakeAdventure.globalId(),
    });
    expect(result.id).toBe(fakeAdventure.id);
  });

  test('it works when searching by a database ID', async () => {
    const result = await getAdventure({
      searchField: '_id',
      value: fakeAdventure.id,
    });
    expect(result.id).toBe(fakeAdventure.id);
  });

  test('it works when searching by an adventure code', async () => {
    const result = await getAdventure({
      searchField: 'adventureCode',
      value: '123',
    });
    expect(result.id).toBe(fakeAdventure.id);
  });

  afterAll(async () => {
    await resetAfter();
  });
});

describe('getAdventures', () => {
  beforeAll(async () => {
    await resetBefore();
    await Adventure.query().insert([
      {
        adventureCode: '123',
        name: 'SUP',
        themeName: 'SUP',
        capacityPerPeriod: 50,
        periodsOffered: 11,
        periodsRequired: 1,
        premiumAdventure: false,
        hidden: false,
        location: 'onsite',
        workflowState: 'active',
      },
      {
        adventureCode: '234',
        name: 'SCUBA',
        themeName: 'SCUBA',
        capacityPerPeriod: 100,
        periodsOffered: 11,
        periodsRequired: 1,
        premiumAdventure: true,
        hidden: false,
        location: 'offsite',
        fee: 45,
        workflowState: 'active',
      },
      {
        adventureCode: '345',
        name: 'Canoeing',
        themeName: 'Canoeing',
        capacityPerPeriod: 100,
        periodsOffered: 11,
        periodsRequired: 1,
        premiumAdventure: false,
        hidden: false,
        location: 'onsite',
        workflowState: 'active',
      },
      {
        adventureCode: '456',
        name: 'Kayaking',
        themeName: 'Kayaking',
        capacityPerPeriod: 100,
        periodsOffered: 11,
        periodsRequired: 1,
        premiumAdventure: true,
        hidden: false,
        location: 'offsite',
        workflowState: 'defined',
      },
      {
        adventureCode: '999',
        name: 'Wharrrgarbl',
        themeName: 'Wharrrgarbl',
        capacityPerPeriod: 100,
        periodsOffered: 11,
        periodsRequired: 1,
        premiumAdventure: true,
        hidden: false,
        location: 'offsite',
        workflowState: 'deleted',
      },
    ]);
  });

  test('it returns only active Adventures when no args passed', async () => {
    const results = await getAdventures({});
    expect(results).toHaveLength(3);
  });

  test('it returns correct results when filtering by workflowState', async () => {
    const results = await getAdventures({ workflowState: 'defined' });
    expect(results).toHaveLength(1);
  });

  test('it returns correct results when filtering by location', async () => {
    const results = await getAdventures({ location: 'onsite' });
    expect(results).toHaveLength(2);
  });

  test('it returns correct results when filtering by premiumAdventure', async () => {
    const results = await getAdventures({ premiumAdventure: true });
    expect(results).toHaveLength(1);
  });

  test('it returns correct results when filtering by name', async () => {
    const results = await getAdventures({ name: 'SUP' });
    expect(results[0].name).toBe('SUP');
  });

  afterAll(async () => {
    await resetAfter();
  });
});

afterAll(() => {
  destroyDbConnection();
});
