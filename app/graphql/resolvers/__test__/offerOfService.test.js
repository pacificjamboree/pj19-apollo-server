const uuid = require('uuid');
const {
  resetBefore,
  resetAfter,
  destroyDbConnection,
} = require('../../../../test_helpers/resetDb');
const { OfferOfService, Adventure } = require('../../../models');
const {
  getOfferOfService,
  getOffersOfService,
  createOfferOfService,
  toggleWorkflowState,
  changeAssignment,
  updateOfferOfService,
  selectOfferOfService,
} = require('../offerOfService');

describe('selectOfferOfService', async () => {
  let fake;
  beforeAll(async () => {
    await resetBefore();
    fake = await OfferOfService.query()
      .insert({
        firstName: 'Michael',
        lastName: 'Burnham',
        oosNumber: '12345',
        birthdate: '1979-01-01',
        email: 'michael.burnham@starfleet.org',
        phone1: '555-123-4567',
        prerecruited: true,
        prerecruitedBy: 'Gabriel Lorca',
        specialSkills: 'mutiny',
        workflowState: 'active',
      })
      .returning('*')
      .eager('[assignment, assignment.managers]');
  });

  test('it should return the OfferOfService', async () => {
    const result = await selectOfferOfService(fake.id);
    expect(result).toEqual(fake);
  });

  test('it should throw when no OOS found', async () => {
    const id = uuid.v4();
    await expect(selectOfferOfService(id)).rejects.toThrow(
      `No Offer of Service with ID ${id} exists`
    );
  });

  afterAll(async () => {
    await resetAfter();
  });
});

describe('getOfferOfService', () => {
  let fake;
  beforeAll(async () => {
    await resetBefore();
    fake = await OfferOfService.query()
      .insert({
        firstName: 'Michael',
        lastName: 'Burnham',
        oosNumber: '12345',
        birthdate: '1979-01-01',
        email: 'michael.burnham@starfleet.org',
        phone1: '555-123-4567',
        prerecruited: true,
        prerecruitedBy: 'Gabriel Lorca',
        specialSkills: 'mutiny',
        workflowState: 'active',
      })
      .returning('*');
  });

  test('returns an instance of OfferOfService', async () => {
    const oos = await getOfferOfService({
      searchField: 'oosNumber',
      value: '12345',
    });
    expect(oos).toBeInstanceOf(OfferOfService);
  });

  test('returns the right record when searching by a relay global ID', async () => {
    const value = fake.globalId();
    const oos = await getOfferOfService({
      searchField: 'id',
      value,
    });
    expect(oos.id).toEqual(fake.id);
  });

  test('returns the right record when searching by a database ID', async () => {
    const oos = await getOfferOfService({
      searchField: '_id',
      value: fake.id,
    });
    expect(oos.id).toEqual(fake.id);
  });
  afterAll(async () => {
    await resetAfter();
  });
});

describe('getOffersOfService', () => {
  beforeAll(async () => {
    await resetBefore();
    await OfferOfService.query()
      .insert([
        {
          firstName: 'Michael',
          lastName: 'Burnham',
          oosNumber: '12345',
          birthdate: '1979-01-01',
          email: 'michael.burnham@starfleet.org',
          phone1: '555-123-4567',
          prerecruited: true,
          prerecruitedBy: 'Gabriel Lorca',
          specialSkills: 'mutiny',
          workflowState: 'active',
        },
        {
          firstName: 'Gabriel',
          lastName: 'Lorca',
          oosNumber: '23456',
          birthdate: '1979-01-01',
          email: 'gabriel.lorca@starfleet.org',
          phone1: '555-123-4567',
          prerecruited: false,
          workflowState: 'deleted',
        },
        {
          firstName: 'Phillippa',
          lastName: 'Georgiou',
          oosNumber: '345767',
          birthdate: '1979-01-01',
          email: 'phillippa.georgiou@starfleet.org',
          phone1: '555-123-4567',
          workflowState: 'active',
        },
        {
          firstName: 'Sylvia',
          lastName: 'Tilly',
          oosNumber: '45678',
          birthdate: '1979-01-01',
          email: 'sylvia.tilly@starfleet.org',
          phone1: '555-123-4567',
          specialSkills: 'snoring',
          workflowState: 'defined',
        },
      ])
      .returning('*');
  });

  test('returns only active OffersOfService when no args passed', async () => {
    const results = await getOffersOfService({});
    expect(results.length).toBe(2);
  });

  test('returns correct results when filtering by workflowState', async () => {
    const results = await getOffersOfService({ workflowState: 'defined' });
    expect(results.length).toBe(1);
  });

  test('returns correct results when filtering by assignedFilter', async () => {
    const results = await getOffersOfService({
      assigned: true,
    });
    expect(results.length).toBe(0);
  });

  test('returns correct results when filtering by name', async () => {
    const results = await getOffersOfService({
      name: 'Mic',
    });
    expect(results.length).toBe(1);
    expect(results[0].firstName).toBe('Michael');
  });

  test('returns correct results when filtering by email address', async () => {
    const results = await getOffersOfService({
      email: 'michael.burnham@starfleet.org',
    });
    expect(results.length).toBe(1);
  });

  test('returns correct results when not explicitly passing workflowState', async () => {
    const results = await getOffersOfService({
      email: 'sylvia.tilly@starfleet.org',
    });
    expect(results.length).toBe(0);
  });
  afterAll(async () => {
    await resetAfter();
  });
});

describe('createOfferOfService', () => {
  beforeAll(async () => {
    await resetBefore();
  });

  test('it successfully creates an OfferOfService', async () => {
    const payload = {
      firstName: 'Michael',
      lastName: 'Burnham',
      oosNumber: '12345',
      birthdate: '1979-01-01',
      email: 'michael.burnham@starfleet.org',
      phone1: '555-123-4567',
      prerecruited: true,
      prerecruitedBy: 'Gabriel Lorca',
      specialSkills: 'mutiny',
      workflowState: 'active',
      clientMutationId: 'CREATE_BURNHAM',
    };

    const { OfferOfService: result } = await createOfferOfService(payload);
    expect(result).toBeInstanceOf(OfferOfService);
    expect(result.oosNumber).toBe('12345');
    expect(result).not.toHaveProperty('clientMutationId');
  });

  test('it throws when creating a record with a duplicate oosNumber', async () => {
    const payload = {
      firstName: 'Michael',
      lastName: 'Burnham',
      oosNumber: '12345',
      birthdate: '1979-01-01',
      email: 'michael.burnham@starfleet.org',
      phone1: '555-123-4567',
      prerecruited: true,
      prerecruitedBy: 'Gabriel Lorca',
      specialSkills: 'mutiny',
      workflowState: 'active',
      clientMutationId: 'CREATE_BURNHAM',
    };
    await expect(createOfferOfService(payload)).rejects.toThrow(
      'oos_oos_number_unique'
    );
  });

  afterAll(async () => {
    await resetAfter();
  });
});

describe('toggleWorkflowState', () => {
  let fakeAdventure, fakeOOS;
  const knex = OfferOfService.knex();
  beforeAll(async () => {
    await resetBefore();
    // create an adventure
    // create an offer of service
    // make the offer of service a manager of the adventure

    fakeAdventure = await Adventure.query()
      .insert({
        adventureCode: '123',
        name: 'test',
        themeName: 'test',
        capacityPerPeriod: 100,
        periodsOffered: 11,
        periodsRequired: 1,
        premiumAdventure: false,
        hidden: false,
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
        prerecruitedBy: 'Gabriel Lorca',
        specialSkills: 'mutiny',
        workflowState: 'active',
        assignedAdventureId: fakeAdventure.id,
      })
      .returning('*')
      .eager('assignment');

    await knex('adventure_manager').insert({
      oosId: fakeOOS.id,
      adventureId: fakeAdventure.id,
    });
  });

  test('toggling from active to defined should not affect adventure assignment ', async () => {
    const result = await toggleWorkflowState({
      workflowState: 'defined',
      id: fakeOOS.globalId(),
    });

    const checkAdventureManagerStatus = await knex('adventure_manager').where({
      oosId: fakeOOS.id,
    });

    expect(result.OfferOfService.workflowState).toBe('defined');
    expect(result.OfferOfService.assignment).not.toBeNull();
    expect(checkAdventureManagerStatus).not.toHaveLength(0);
  });

  test('toggling to deleted should remove the adventure assignment and manager role', async () => {
    const result = await toggleWorkflowState({
      workflowState: 'deleted',
      id: fakeOOS.globalId(),
    });

    const checkAdventureManagerStatus = await knex('adventure_manager').where({
      oosId: fakeOOS.id,
    });

    expect(result.OfferOfService.assignment).toBeNull();
    expect(checkAdventureManagerStatus).toHaveLength(0);
  });

  afterAll(async () => {
    await resetAfter();
  });
});

describe('changeAssigment', () => {
  const knex = OfferOfService.knex();
  let fakeOOS, fakeAdventures;

  beforeEach(async () => {
    fakeOOS = undefined;
    fakeAdventures = undefined;
    await resetBefore();
    fakeAdventures = await Adventure.query()
      .insert([
        {
          adventureCode: '123',
          name: 'test1',
          themeName: 'test1',
          capacityPerPeriod: 100,
          periodsOffered: 11,
          periodsRequired: 1,
          premiumAdventure: false,
          hidden: false,
        },
        {
          adventureCode: '456',
          name: 'test2',
          themeName: 'test2',
          capacityPerPeriod: 100,
          periodsOffered: 11,
          periodsRequired: 1,
          premiumAdventure: false,
          hidden: false,
        },
      ])
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
        prerecruitedBy: 'Gabriel Lorca',
        specialSkills: 'mutiny',
        workflowState: 'active',
        assignedAdventureId: fakeAdventures[0].id,
      })
      .returning('*')
      .eager('[assignment, assignment.managers]');
  });

  test('it returns the OOS when attempting to assign to same adventure', async () => {
    const result = await changeAssignment({
      oosId: fakeOOS.globalId(),
      adventureId: fakeAdventures[0].globalId(),
    });
    expect(result.OfferOfService).toEqual(fakeOOS);
  });

  test('it throws when the subject OOS is manager of an adventure', async () => {
    // make the oos a manager
    await knex('adventure_manager').insert({
      oosId: fakeOOS.id,
      adventureId: fakeAdventures[0].id,
    });
    // refresh the fakeOOS object
    fakeOOS = await fakeOOS.$query().eager('[assignment, assignment.managers]');

    await expect(
      changeAssignment({
        oosId: fakeOOS.globalId(),
        adventureId: fakeAdventures[1].globalId(),
      })
    ).rejects.toThrow();
  });

  test('it successfully reassigns a non-manager to a different adventure', async () => {
    // remove fakeOOS as an adventureManager
    const result = await changeAssignment({
      oosId: fakeOOS.globalId(),
      adventureId: fakeAdventures[1].globalId(),
    });

    expect(result.OfferOfService.assignment.id).toBe(fakeAdventures[1].id);
  });

  afterEach(async () => {
    await resetAfter();
  });
});

describe('updateOfferOfService', () => {
  let fakeOOS;
  beforeAll(async () => {
    await resetBefore();
    fakeOOS = await OfferOfService.query()
      .insert({
        firstName: 'Michael',
        lastName: 'Burnham',
        oosNumber: '12345',
        birthdate: '1979-01-01',
        email: 'michael.burnham@starfleet.org',
        phone1: '555-123-4567',
        prerecruited: true,
        prerecruitedBy: 'Gabriel Lorca',
        specialSkills: 'mutiny',
        workflowState: 'active',
      })
      .returning('*');
  });

  test('it should update the OfferOfService', async () => {
    const additionalInformation = 'Served as first officer on USS Shenzhou';
    const result = await updateOfferOfService({
      id: fakeOOS.globalId(),
      OfferOfService: {
        additionalInformation,
      },
    });
    expect(result.OfferOfService.additionalInformation).toBe(
      additionalInformation
    );
  });

  afterAll(async () => {
    await resetAfter();
  });
});

afterAll(() => {
  destroyDbConnection();
});
