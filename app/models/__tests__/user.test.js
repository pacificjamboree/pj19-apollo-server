const {
  User,
  OfferOfService,
  PatrolScouter,
  Patrol,
  Adventure,
} = require('../index');

const {
  resetBefore,
  resetAfter,
  destroyDbConnection,
} = require('../../../test_helpers/resetDb');

const scouterFactory = require('../../../test_helpers/scouterFactory');

describe('Password hashing and verifying', () => {
  let fakeOOS, fakeUser;
  beforeEach(async () => {
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

    fakeUser = await User.query()
      .insert({
        oosId: fakeOOS.id,
        username: fakeOOS.email,
      })
      .returning('*');
  });

  test(`it sets the user's password`, async () => {
    const user = await fakeUser.setPassword('password123');
    expect(user.passwordHash).not.toBeNull();
  });

  test(`it verifies the user's password as correct`, async () => {
    await fakeUser.setPassword('password123');
    const result = await fakeUser.verifyPassword('password123');
    expect(result).toBe(true);
  });

  test(`it verifies the user's password as incorrect`, async () => {
    await fakeUser.setPassword('password123');
    const result = await fakeUser.verifyPassword('123password');
    expect(result).toBe(false);
  });

  afterEach(async () => {
    await resetAfter();
  });
});

describe('User model with OOS attached', async () => {
  let fakeOOS, fakeUser;
  beforeEach(async () => {
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

    fakeUser = await User.query()
      .insert({
        oosId: fakeOOS.id,
        username: fakeOOS.email,
        passwordHash: 'passw0rd',
      })
      .returning('*');
  });

  test('it returns a User', async () => {
    const user = await User.query()
      .where({ id: fakeUser.id })
      .first();
    expect(user).toBeInstanceOf(User);
  });

  test('returns true for isOfferOfService', async () => {
    expect(fakeUser.isOfferOfService()).toBe(true);
  });

  test('returns false for isPatrolScouter', async () => {
    expect(fakeUser.isPatrolScouter()).toBe(false);
  });

  afterEach(async () => {
    await resetAfter();
  });
});

describe('User model with PatrolScouter attached', async () => {
  let fakeScouter, fakePatrol, fakeUser;
  beforeEach(async () => {
    await resetBefore();
    fakePatrol = await Patrol.query()
      .insert({
        patrolNumber: '123',
        name: '1st Test Patrol',
        numberOfScouts: 8,
        numberOfScouters: 2,
        workflowState: 'active',
      })
      .returning('*');

    fakeScouter = await PatrolScouter.query()
      .insert(scouterFactory(fakePatrol.id))
      .returning('*');

    fakeUser = await User.query()
      .insert({
        patrolScouterId: fakeScouter.id,
        username: fakeScouter.email,
        passwordHash: 'passw0rd',
      })
      .returning('*');
  });

  test('it returns a User', async () => {
    const user = await User.query()
      .where({ id: fakeUser.id })
      .first();
    expect(user).toBeInstanceOf(User);
  });

  test('returns false for isOfferOfService', async () => {
    expect(fakeUser.isOfferOfService()).toBe(false);
  });

  test('returns true for isPatrolScouter', async () => {
    expect(fakeUser.isPatrolScouter()).toBe(true);
  });

  afterEach(async () => {
    await resetAfter();
  });
});

describe('User model with both OOS & PatrolScouter attached', async () => {
  let fakeScouter, fakePatrol, fakeOOS, fakeUser;
  beforeEach(async () => {
    await resetBefore();
    fakePatrol = await Patrol.query()
      .insert({
        patrolNumber: '123',
        name: '1st Test Patrol',
        numberOfScouts: 8,
        numberOfScouters: 2,
        workflowState: 'active',
      })
      .returning('*');

    fakeScouter = await PatrolScouter.query()
      .insert(scouterFactory(fakePatrol.id))
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
      })
      .returning('*');

    fakeUser = await User.query()
      .insert({
        oosId: fakeOOS.id,
        patrolScouterId: fakeScouter.id,
        username: fakeScouter.email,
        passwordHash: 'passw0rd',
      })
      .returning('*');
  });

  test('returns true for both user types', async () => {
    expect(fakeUser.isOfferOfService()).toBe(true);
    expect(fakeUser.isPatrolScouter()).toBe(true);
  });

  afterEach(async () => {
    await resetAfter();
  });
});

describe('User model with OOS AdventureManager attached', async () => {
  let fakeOOS, fakeAdventure, fakeUser;
  beforeEach(async () => {
    await resetBefore();
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
      .returning('*');

    fakeUser = await User.query()
      .insert({
        oosId: fakeOOS.id,
        username: fakeOOS.email,
        passwordHash: 'passw0rd',
      })
      .returning('*');
  });

  test('it returns false when User has no OOS attached', async () => {
    await fakeUser.$query().patch({ oosId: null });
    expect(await fakeUser.isAdventureManager()).toBe(false);
  });

  test('it returns false when User is an unassigned OOS', async () => {
    await fakeOOS.$query().patch({ assignedAdventureId: null });
    expect(await fakeUser.isAdventureManager()).toBe(false);
  });

  test('it returns false when User is an assigned OOS but not a manager', async () => {
    expect(await fakeUser.isAdventureManager()).toBe(false);
  });

  test('it returns true when User is a manager', async () => {
    const knex = User.knex();
    await knex('adventure_manager').insert({
      oosId: fakeOOS.id,
      adventureId: fakeAdventure.id,
    });
    expect(await fakeUser.isAdventureManager()).toBe(true);
  });

  afterEach(async () => {
    await resetAfter();
  });
});

describe('admin User model', async () => {
  let fakeOOS, fakeUser;
  beforeEach(async () => {
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

    fakeUser = await User.query()
      .insert({
        oosId: fakeOOS.id,
        username: fakeOOS.email,
        passwordHash: 'passw0rd',
      })
      .returning('*');
  });

  test('it returns false when user is not an admin', async () => {
    expect(fakeUser.isAdmin()).toBe(false);
  });

  test('it returns true when user is an admin', async () => {
    await fakeUser.$query().patch({ admin: true });
    expect(fakeUser.isAdmin()).toBe(true);
  });

  afterEach(async () => {
    await resetAfter();
  });
});

afterAll(() => {
  destroyDbConnection();
});
