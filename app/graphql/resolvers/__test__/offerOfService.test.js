const { OfferOfService } = require('../../../models');
const { getOfferOfService } = require('../offerOfService');
const knex = OfferOfService.knex();

const migrationOpts = {
  directory: `${process.cwd()}/db/migrations`,
};

beforeAll(async () => {
  await knex.migrate.rollback(migrationOpts);
  await knex.migrate.latest(migrationOpts);
  await OfferOfService.query()
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

test('returns an OfferOfService', async () => {
  const testOOS = await getOfferOfService({
    searchField: 'oosNumber',
    value: '12345',
  });
  expect(testOOS).toBeInstanceOf(OfferOfService);
  expect(testOOS.oosNumber).toEqual('12345');
});

afterAll(async () => {
  await knex.migrate.rollback(migrationOpts);
});
