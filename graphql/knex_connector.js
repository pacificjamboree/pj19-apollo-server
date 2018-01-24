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
  getAssignmentForOOS({ assigned_adventure_id }) {
    return knex('adventure')
      .where({ id: assigned_adventure_id })
      .first();
  },
  async insertOfferOfService({ input }) {
    try {
      const k = await knex('oos')
        .insert(input)
        .returning('*');
      console.log(k);
      return { OfferOfService: k[0] };
    } catch (e) {
      throw e;
    }
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
  },
  getOOSForAdventure({ id }) {
    return knex('oos').where({ assigned_adventure_id: id });
  }
};
