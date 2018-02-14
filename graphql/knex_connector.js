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
  getAllOffersOfService({ workflowState = 'active', assigned, email, name }) {
    const assignedFilter = (qb, assigned) => {
      if (assigned === undefined) return;
      const query = { assigned_adventure_id: null };

      assigned ? qb.andWhereNot(query) : qb.andWhere(query);
    };

    const emailFilter = (qb, email) => {
      if (email !== undefined) {
        qb.andWhere({ email });
      }
    };

    const nameFilter = (qb, name) => {
      if (name !== undefined) {
        qb
          .where('firstName', 'ilike', `${name}%`)
          .orWhere('lastName', 'ilike', `${name}%`);
      }
    };

    return knex
      .from('oos')
      .select('*')
      .whereIn('workflowState', workflowState)
      .modify(assignedFilter, assigned)
      .modify(emailFilter, email)
      .modify(nameFilter, name);
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

        // if an OOS is being deleted, remove it from adventure_manager
        if (workflowState === 'deleted') {
          await knex('adventure_manage')
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

  getAllAdventures({
    workflowState = 'active',
    location = ['onsite', 'offsite'],
    premiumAdventure,
    name,
    themeName,
  }) {
    const premiumActivityFilter = (qb, premiumAdventure) => {
      if (premiumAdventure) {
        qb.andWhere('premiumAdventure', premiumAdventure);
      }
    };

    const nameFilter = (qb, name, themeName) => {
      if (name || themeName) {
        qb
          .where('name', 'ilike', `%${name}%`)
          .orWhere('theme_name', 'ilike', `%${themeName}%`);
      }
    };
    return knex
      .from('adventure')
      .select('*')
      .whereIn('workflowState', workflowState)
      .whereIn('location', location)
      .modify(premiumActivityFilter, premiumAdventure)
      .modify(nameFilter, name, themeName);
  },
  getAdventure({ searchField, value }) {
    return knex
      .from('adventure')
      .select('*')
      .where({ [searchField]: value })
      .first();
  },
  getOOSForAdventure({ id }) {
    return knex('oos').where({ assignedAdventureId: id });
  },
  getManagersForAdventure({ id }) {
    return knex('oos')
      .select('oos.*')
      .where({ 'adventure.id': id })
      .leftJoin('adventure_manager', 'oos.id', 'adventure_manager.oos_id')
      .leftJoin('adventure', 'adventure.id', 'adventure_manager.adventure_id');
  },

  async assignManagerToAdventure(adventureId, { oosId }) {
    try {
      const oos = await selectOOS(oosId);
      await knex('adventure_manager')
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
      const adventure_manager = await knex('adventure_manager')
        .where({ adventure_id: adventureId, oos_id: oosId })
        .first();
      if (!adventure_manager) {
        throw new Error(
          `OOS with ID ${oosId} is not a manager for Adventure with ID ${adventureId}`
        );
      }

      await knex('adventure_manager')
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

  getAllPatrols({ workflowState = 'active', name, fullyPaid }) {
    const nameFilter = (qb, name) => {
      if (name !== undefined) {
        qb.where('name', 'ilike', `${name}%`);
      }
    };

    const fullyPaidFilter = (qb, fullyPaid) => {
      if (fullyPaid === undefined) return;
      const query = { finalPaymentReceived: null };

      fullyPaid ? qb.andWhereNot(query) : qb.andWhere(query);
    };

    return knex('patrol')
      .select('*')
      .whereIn('workflowState', workflowState)
      .modify(nameFilter, name)
      .modify(fullyPaidFilter, fullyPaid);
  },

  getPatrol({ searchField, value }) {
    return knex
      .from('patrol')
      .select('*')
      .where({ [searchField]: value })
      .first();
  },

  getScoutersForPatrol({ id }) {
    return knex('patrol_scouter').where({
      patrol_id: id,
    });
  },
};
