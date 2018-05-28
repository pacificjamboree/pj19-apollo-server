// get all OOS for each Adventure
// pick one at random
// insert into adventure_manager

const { Adventure } = require('../../../app/models');

exports.seed = async (knex, Promise) => {
  const adventures = await Adventure.query().eager('offersOfService');

  const payload = adventures.map(a => ({
    adventure_id: a.id,
    oos_id:
      a.offersOfService[Math.floor(Math.random() * a.offersOfService.length)]
        .id,
  }));
  return knex('adventure_manager').insert(payload);
};
