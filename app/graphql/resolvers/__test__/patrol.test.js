const { Patrol } = require('../../../models');
const { getPatrol, getPatrols } = require('../patrol');
const {
  resetBefore,
  resetAfter,
  destroyDbConnection,
} = require('../../../../test_helpers/resetDb');

describe('getPatrol', () => {
  let fakePatrol;
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
  });

  test('it returns an instance of Patrol', async () => {
    const result = await getPatrol({
      searchField: '_id',
      value: fakePatrol.id,
    });
    expect(result).toBeInstanceOf(Patrol);
  });

  test('it should have a patrolScouters property', async () => {
    const result = await getPatrol({
      searchField: '_id',
      value: fakePatrol.id,
    });
    expect(result).toHaveProperty('patrolScouters');
    expect(result.patrolScouters).toHaveLength(0); // because we haven't added any
  });

  test('it works when searching by a Relay global ID', async () => {
    const result = await getPatrol({
      searchField: 'id',
      value: fakePatrol.globalId(),
    });
    expect(result.id).toBe(fakePatrol.id);
  });

  test('it works when searching by database ID', async () => {
    const result = await getPatrol({
      searchField: '_id',
      value: fakePatrol.id,
    });
    expect(result.id).toBe(fakePatrol.id);
  });

  test('it works when searching by patrol number', async () => {
    const result = await getPatrol({
      searchField: 'patrolNumber',
      value: '123',
    });
    expect(result.id).toBe(fakePatrol.id);
  });

  test('it returns undefined when no results found', async () => {
    const result = await getPatrol({
      searchField: 'patrolNumber',
      value: '234',
    });
    expect(result).toBeUndefined();
  });

  afterEach(async () => {
    await resetAfter();
  });
});

describe('getPatrols', () => {
  let fakePatrols;
  beforeEach(async () => {
    await resetBefore();
    fakePatrols = await Patrol.query()
      .insert([
        {
          patrolNumber: '123',
          name: '1st Test Patrol',
          numberOfScouts: 8,
          numberOfScouters: 2,
          workflowState: 'active',
        },
        {
          patrolNumber: '234',
          name: '2nd Test Patrol',
          numberOfScouts: 6,
          numberOfScouters: 2,
          workflowState: 'active',
          finalPaymentReceived: new Date(),
        },
        {
          patrolNumber: '345',
          name: '3rd Test Patrol',
          numberOfScouts: 8,
          numberOfScouters: 3,
          workflowState: 'active',
        },
        {
          patrolNumber: '456',
          name: '4th Test Patrol',
          numberOfScouts: 5,
          numberOfScouters: 2,
          workflowState: 'defined',
        },
      ])
      .returning('*');
  });

  test('it returns only active Patrols when no args passed', async () => {
    const results = await getPatrols({});
    expect(results).toHaveLength(3);
  });

  test('it only returns paid patrols when filtering by fullyPaid:true', async () => {
    const results = await getPatrols({ fullyPaid: true });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(fakePatrols[1].id);
  });

  test('it only returns unpaid patrols when filtering by fullyPaid:false', async () => {
    const results = await getPatrols({ fullyPaid: false });
    expect(results).toHaveLength(2);
  });

  test('it works when filtering by name', async () => {
    const results = await getPatrols({ name: '1st Test' });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(fakePatrols[0].id);
  });

  test('it works with complex filters', async () => {
    const results = await getPatrols({
      workflowState: 'defined',
      name: 'test',
    });
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('4th Test Patrol');
  });

  afterEach(async () => {
    await resetAfter();
  });
});

afterAll(() => {
  destroyDbConnection();
});
