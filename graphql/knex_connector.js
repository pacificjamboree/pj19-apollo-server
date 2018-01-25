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
  getAssignmentForOOS({ assignedAdventureId }) {
    return knex('adventure')
      .where({ id: assignedAdventureId })
      .first();
  },
  async insertOfferOfService({ input }) {
    try {
      const k = await knex('oos')
        .insert(input)
        .returning('*');
      return { OfferOfService: k[0] };
    } catch (e) {
      throw e;
    }
  },
  async toggleOOSWorkflowState(payload) {
    const { workflowState, id, oosNumber } = payload;
    const query = id ? { id } : { oosNumber };
    try {
      const k = await knex('oos')
        .where(query)
        .update({ workflowState })
        .returning('*');
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
