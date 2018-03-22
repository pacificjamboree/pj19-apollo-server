const { transaction } = require('objection');
const { Adventure } = require('../../../models');
const knex = Adventure.knex();
const { getAdventure, getAdventures } = require('../adventure');
const {
  resetBefore,
  resetAfter,
  destroyDbConnection,
} = require('../../../../test_helpers/resetDb');

describe('getAdventure', () => {
  let trx, fakeAdventure;
  beforeAll(async () => {
    trx = await transaction.start(knex);
    fakeAdventure = await Adventure.query(trx)
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
    const result = await getAdventure(
      {
        searchField: '_id',
        value: fakeAdventure.id,
      },
      trx
    );
    expect(result).toBeInstanceOf(Adventure);
  });

  test('it works when searching by a relay gloabl ID', async () => {
    const result = await getAdventure(
      {
        searchField: 'id',
        value: fakeAdventure.globalId(),
      },
      trx
    );
    expect(result.id).toBe(fakeAdventure.id);
  });

  test('it works when searching by a database  ID', async () => {
    const result = await getAdventure(
      {
        searchField: '_id',
        value: fakeAdventure.id,
      },
      trx
    );
    expect(result.id).toBe(fakeAdventure.id);
  });

  afterAll(async () => {
    trx.rollback();
  });
});

// describe('getAdventures', () => {
//   beforeAll(async () => {
//     await resetBefore();
//   });
//   afterAll(async () => {
//     await resetAfter();
//   });
// });

afterAll(() => {
  // console.log('ADVENTURE AFTER ALL');
  destroyDbConnection();
});
