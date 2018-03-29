const { Patrol, PatrolScouter } = require('../../../models');
const { getPatrolScouter, getPatrolScouters } = require('../patrolScouter');
const casual = require('casual');

const scouterFactory = (patrol_id, workflow_state = 'active') => ({
  patrol_id,
  first_name: casual.first_name,
  last_name: casual.last_name,
  email: casual.email,
  workflow_state,
});

const {
  resetBefore,
  resetAfter,
  destroyDbConnection,
} = require('../../../../test_helpers/resetDb');

describe('getPatrolScouter', () => {
  let fakePatrol, fakeScouters;
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
    fakeScouters = await PatrolScouter.query()
      .insert([scouterFactory(fakePatrol.id), scouterFactory(fakePatrol.id)])
      .returning('*');
  });

  test('it returns an instance of PatrolScouter', async () => {
    const result = await getPatrolScouter({
      searchField: '_id',
      value: fakeScouters[0].id,
    });
    expect(result).toBeInstanceOf(PatrolScouter);
  });

  test('it should have a Patrol attached to it', async () => {
    const result = await getPatrolScouter({
      searchField: '_id',
      value: fakeScouters[0].id,
    });
    expect(result.patrol).toBeInstanceOf(Patrol);
    expect(result.patrol.id).toBe(fakePatrol.id);
  });

  test('it works when searching by a Relay global ID', async () => {
    const result = await getPatrolScouter({
      searchField: 'id',
      value: fakeScouters[0].globalId(),
    });
    expect(result.id).toBe(fakeScouters[0].id);
  });

  test('it works when searching by database ID', async () => {
    const result = await getPatrolScouter({
      searchField: '_id',
      value: fakeScouters[0].id,
    });
    expect(result.id).toBe(fakeScouters[0].id);
  });

  afterEach(async () => {
    await resetAfter();
  });
});

describe('getPatrolScouters', () => {
  let fakePatrol, fakeScouters;
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
    fakeScouters = await PatrolScouter.query()
      .insert([
        scouterFactory(fakePatrol.id),
        scouterFactory(fakePatrol.id),
        scouterFactory(fakePatrol.id, 'defined'),
      ])
      .returning('*');
  });

  test('it returns only active PatrolScouters when no args passed', async () => {
    const results = await getPatrolScouters({});
    expect(results).toHaveLength(2);
  });

  test('it returns correct results when filtering by name', async () => {
    const results = await getPatrolScouters({
      name: fakeScouters[0].firstName,
    });
    expect(results[0].id).toBe(fakeScouters[0].id);
  });

  test('it returns correct results when filtering by patrol number', async () => {
    const results = await getPatrolScouters({ patrolNumber: '123' });
    expect(results).toHaveLength(2);
  });

  afterEach(async () => {
    await resetAfter();
  });
});

afterAll(() => {
  destroyDbConnection();
});
