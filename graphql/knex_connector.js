const knexStringcase = require('knex-stringcase');
const opts = knexStringcase(require('../knexfile')[process.env.NODE_ENV]);
const knex = require('knex')(opts);

const selectOOS = async id => {
  try {
    const oos = await knex('oos')
      .where({ id })
      .select('*')
      .first();
    if (!oos) {
      throw new Error(`No Offer of Service with ID ${id} exists`);
    }
    return oos;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getAllOffersOfService() {
    return knex.from('oos').select('*');
  },
  getOfferOfService({ searchField, value }) {
    return knex
      .from('oos')
      .select('*')
      .where({ [searchField]: value })
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
    const update = { workflowState };
    // if an OOS is being deleted, un-assign it from an Adventure
    if (workflowState === 'deleted') {
      update['assignedAdventureId'] = null;
    }

    try {
      const result = await knex.transaction(async t => {
        const oos = await knex('oos')
          .transacting(t)
          .update(update)
          .where(query)
          .returning('*');

        // if an OOS is being deleted, remove it from adventure_managers
        if (workflowState === 'deleted') {
          await knex('adventure_managers')
            .transacting(t)
            .where({ oos_id: oos[0].id })
            .del();
        }
        return { OfferOfService: oos[0] };
      });
      return result;
    } catch (e) {
      throw e;
    }
  },

  async changeOOSAssignment(id, newAssignmentId) {
    try {
      await selectOOS(id);
      const k = await knex('oos')
        .where({ id })
        .update({
          assignedAdventureId: newAssignmentId,
        })
        .returning('*');
      return { OfferOfService: k[0] };
    } catch (e) {
      throw e;
    }
  },
  async updateOOS(id, payload) {
    try {
      await selectOOS(id);
      const k = await knex('oos')
        .where({ id })
        .update(payload)
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
  },
  getManagersForAdventure({ id }) {
    return knex('oos')
      .select('oos.*')
      .where({ 'adventure.id': id })
      .leftJoin('adventure_managers', 'oos.id', 'adventure_managers.oos_id')
      .leftJoin('adventure', 'adventure.id', 'adventure_managers.adventure_id');
  },

  async assignManagerToAdventure(adventureId, { oosId }) {
    try {
      const oos = await selectOOS(oosId);
      await knex('adventure_managers')
        .insert({
          adventure_id: adventureId,
          oos_id: oosId,
        })
        .returning('*');

      const Adventure = await knex('adventure')
        .select('*')
        .where({ id: adventureId })
        .first();

      return { Adventure, OfferOfService: oos };
    } catch (e) {
      throw e;
    }
  },

  async removeManagerFromAdventure(adventureId, { oosId }) {
    try {
      await selectOOS(oosId);
      const adventure_manager = await knex('adventure_managers')
        .where({ adventure_id: adventureId, oos_id: oosId })
        .first();
      if (!adventure_manager) {
        throw new Error(
          `OOS with ID ${oosId} is not a manager for Adventure with ID ${adventureId}`
        );
      }

      await knex('adventure_managers')
        .where({ adventure_id: adventureId, oos_id: oosId })
        .del();

      const Adventure = await knex('adventure')
        .select('*')
        .where({ id: adventureId })
        .first();

      return { Adventure };
    } catch (e) {
      throw e;
    }
  },
};
