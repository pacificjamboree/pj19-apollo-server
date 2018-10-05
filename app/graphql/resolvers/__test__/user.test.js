const { User, OfferOfService } = require('../../../models');
const { getUser } = require('../user');
const {
  resetBefore,
  resetAfter,
  destroyDbConnection,
} = require('../../../../test_helpers/resetDb');

describe('getUser', () => {
  let fakeOOS, fakeUser;
  beforeEach(async () => {
    await resetBefore();
    fakeOOS = await OfferOfService.query()
      .insert({
        firstName: 'Michael',
        lastName: 'Burnham',
        oosNumber: '12345',
        isYouth: false,
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
        username: fakeOOS.email,
        passwordHash: 'passw0rd',
      })
      .returning('*');
  });

  test('it returns an instance of User', async () => {
    const result = await getUser({
      searchField: '_id',
      value: fakeUser.id,
    });
    expect(result).toBeInstanceOf(User);
  });

  test('it works when searching by a relay global ID', async () => {
    const result = await getUser({
      searchField: 'id',
      value: fakeUser.globalId(),
    });
    expect(result.id).toBe(fakeUser.id);
  });

  test('it works when searching by a database ID', async () => {
    const result = await getUser({
      searchField: '_id',
      value: fakeUser.id,
    });
    expect(result.id).toBe(fakeUser.id);
  });

  test('it works when searching by username', async () => {
    const result = await getUser({
      searchField: 'username',
      value: fakeUser.username,
    });
    expect(result.id).toBe(fakeUser.id);
  });

  afterEach(async () => {
    await resetAfter();
  });
});

afterAll(() => {
  destroyDbConnection();
});
