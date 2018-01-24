const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV]);

module.exports = {
  getAllOffersOfService() {
    return knex.from('oos').select('*');
  },
  getOfferOfService(oosNumber) {
    return knex
      .from('oos')
      .select('*')
      .where({ oosNumber })
      .first();
  },
  getAssignmentForOOS({ assignedAdventureID }) {
    return knex('adventure')
      .where({ id: assignedAdventureID })
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
  getAdventure(adventureCode) {
    return knex
      .from('adventure')
      .select('*')
      .where({ adventureCode })
      .first();
  },
  getOOSForAdventure({ id }) {
    return knex('oos').where({ assignedAdventureId: id });
  }
};
