const { Adventure, OfferOfService } = require('../../../models');
const {
  getAdventure,
  getAdventures,
  createAdventure,
  assignManagerToAdventure,
  removeManagerFromAdventure,
} = require('../adventure');
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

describe('createAdventure', () => {
  const fakeAdventurePayload = {
    adventureCode: '123',
    name: 'test',
    themeName: 'test',
    description: 'wharrrrrrgarbl',
    location: 'onsite',
    capacityPerPeriod: 100,
    periodsOffered: 11,
    periodsRequired: 1,
  };
  beforeEach(async () => {
    await resetBefore();
  });

  test('it creates an Adventure', async () => {
    const result = await createAdventure(fakeAdventurePayload);
    expect(result.Adventure).toBeInstanceOf(Adventure);
  });

  afterEach(async () => {});
});

describe('assignManagerToAdventure', () => {
  let fakeAdventure, fakeOOS;
  beforeEach(async () => {
    await resetBefore();
    fakeAdventure = await Adventure.query()
      .insert({
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
      })
      .returning('*');

    fakeOOS = await OfferOfService.query()
      .insert({
        firstName: 'Michael',
        lastName: 'Burnham',
        oosNumber: '12345',
        birthdate: '1979-01-01',
        email: 'michael.burnham@starfleet.org',
        phone1: '555-123-4567',
        prerecruited: true,
        assignedAdventureId: fakeAdventure.id,
        prerecruitedBy: 'Gabriel Lorca',
        specialSkills: 'mutiny',
        workflowState: 'active',
      })
      .returning('*');
  });

  test('it throws an error when the OOS is not active', async () => {
    await fakeOOS.$query().patch({ workflowState: 'defined' });
    await expect(
      assignManagerToAdventure({
        adventureId: fakeAdventure.globalId(),
        oosId: fakeOOS.globalId(),
      })
    ).rejects.toThrow('OfferOfService must be active to be a Manager');
  });

  test('it throws an error when the OOS is not assigned to an Adventure', async () => {
    await fakeOOS.$query().patch({ assignedAdventureId: null });
    await expect(
      assignManagerToAdventure({
        adventureId: fakeAdventure.globalId(),
        oosId: fakeOOS.globalId(),
      })
    ).rejects.toThrow(
      'Offer of Service must be assigned to an Adventure to be a Manager'
    );
  });

  test('it throws an error when the OOS is assigned to a different Adventure', async () => {
    const fakeAdventure2 = await Adventure.query()
      .insert({
        adventureCode: '234',
        name: 'test',
        themeName: 'test',
        capacityPerPeriod: 50,
        periodsOffered: 11,
        periodsRequired: 1,
        premiumAdventure: false,
        hidden: false,
        location: 'onsite',
        workflowState: 'active',
      })
      .returning('*');
    await fakeOOS.$query().patch({ assignedAdventureId: fakeAdventure2.id });

    await expect(
      assignManagerToAdventure({
        oosId: fakeOOS.globalId(),
        adventureId: fakeAdventure.globalId(),
      })
    ).rejects.toThrow(
      'Offer of Service must be assigned to the target Adventure to be a Manager'
    );
  });

  test('it successfully assigns the OOS as a manager to the Adventure', async () => {
    await fakeOOS.$query().patch({ assignedAdventureId: fakeAdventure.id });
    const result = await assignManagerToAdventure({
      oosId: fakeOOS.globalId(),
      adventureId: fakeAdventure.globalId(),
    });
    expect(result).toHaveProperty('Adventure');
    expect(result.Adventure).toBeInstanceOf(Adventure);
    expect(result.Adventure.managers.map(m => m.id)).toContain(fakeOOS.id);
  });

  afterEach(async () => {
    await resetAfter();
  });
});

describe('removeManagerFromAdventure', () => {
  let fakeAdventure, fakeOOS;
  beforeEach(async () => {
    await resetBefore();
    fakeAdventure = await Adventure.query()
      .insert({
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
      })
      .returning('*');

    fakeOOS = await OfferOfService.query()
      .insert({
        firstName: 'Michael',
        lastName: 'Burnham',
        oosNumber: '12345',
        birthdate: '1979-01-01',
        email: 'michael.burnham@starfleet.org',
        phone1: '555-123-4567',
        prerecruited: true,
        assignedAdventureId: fakeAdventure.id,
        prerecruitedBy: 'Gabriel Lorca',
        specialSkills: 'mutiny',
        workflowState: 'active',
      })
      .returning('*');
  });

  test('it should throw if the OOS is not a Manager of the Adventure', async () => {
    await expect(
      removeManagerFromAdventure({
        oosId: fakeOOS.globalId(),
        adventureId: fakeAdventure.globalId(),
      })
    ).rejects.toThrow(/is not a manager for Adventure/);
  });

  test('is removes the OOS as a Manager for the Adventure', async () => {
    const payload = {
      oosId: fakeOOS.globalId(),
      adventureId: fakeAdventure.globalId(),
    };
    await assignManagerToAdventure(payload);
    const result = await removeManagerFromAdventure(payload);
    expect(result.Adventure.managers.map(m => m.id)).not.toContain(fakeOOS.id);
  });

  afterEach(async () => {
    await resetAfter();
  });
});

afterAll(() => {
  destroyDbConnection();
});
