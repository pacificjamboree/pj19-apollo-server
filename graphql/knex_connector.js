const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV]);

module.exports = {
  getAllOffersOfService() {
    return knex.from('oos').select('*');
  },
  getOfferOfService(oos_number) {
    return knex
      .from('oos')
      .select('*')
      .where({ oos_number })
      .first();
  },
  getAssignmentForOOS(oos) {
    console.log(oos);
    return knex('adventure')
      .where({ id: oos.assigned_adventure_id })
      .first();
  },
  getAllAdventures() {
    return knex.from('adventure').select('*');
  },
  getAdventure(adventure_code) {
    return knex
      .from('adventure')
      .select('*')
      .where({ adventure_code })
      .first();
  }
};
