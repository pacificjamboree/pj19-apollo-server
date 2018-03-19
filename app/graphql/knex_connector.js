const knex = require('../../db');
const { fromGlobalId } = require('graphql-relay-tools');
const selectOfferOfService = async id => {
  try {
    const oos = await knex('oos')
      .where({ id })
      .select(selectAllWithTypeField('OfferOfService'))
      .first();
    if (!oos) {
      throw new Error(`No Offer of Service with ID ${id} exists`);
    }
    return oos;
  } catch (e) {
    throw e;
  }
};

const whereSearchField = ({ searchField, value }) => {
  switch (searchField) {
    case 'id':
      value = fromGlobalId(value).id;
      break;

    case '_id':
      searchField = 'id';
      break;
  }
  return { [searchField]: value };
};

const selectAllWithTypeField = type => knex.raw(`*, '${type}' as "$type"`);

module.exports = {
  async changeOfferOfServiceAssignment(input) {
    const id = fromGlobalId(input.oosId).id;
    let { adventureId } = input;
    if (adventureId !== null) {
      adventureId = fromGlobalId(adventureId).id;
    }
    try {
      await selectOfferOfService(id);
      const k = await knex('oos')
        .where({ id })
        .update({
          assignedAdventureId: adventureId,
        })
        .returning('*');
      k[0].$type = 'OfferOfService';
      return { OfferOfService: k[0] };
    } catch (e) {
      throw e;
    }
  },

  async updateOfferOfService(input) {
    const id = fromGlobalId(input.id).id;
    const { OfferOfService: payload } = input;
    try {
      await selectOfferOfService(id);
      const k = await knex('oos')
        .where({ id })
        .update(payload)
        .returning('*');
      k[0].$type = 'OfferOfService';
      return { OfferOfService: k[0] };
    } catch (e) {
      throw e;
    }
  },

  async assignManagerToAdventure(input) {
    const adventureId = fromGlobalId(input.adventureId).id;
    const oosId = fromGlobalId(input.oosId).id;
    try {
      const OfferOfService = await selectOfferOfService(oosId);
      await knex('adventure_manager')
        .insert({
          adventureId,
          oosId,
        })
        .returning('*');

      const Adventure = await knex('adventure')
        .select(selectAllWithTypeField('Adventure'))
        .where({ id: adventureId })
        .first();
    } catch (e) {
      throw e;
    }
  },

  async removeManagerFromAdventure(input) {
    const oosId = fromGlobalId(input.oosId).id;
    const adventureId = fromGlobalId(input.adventureId).id;

    try {
      await selectOfferOfService(oosId);
      const adventure_manager = await knex('adventure_manager')
        .where({ adventureId, oosId })
        .first();
      if (!adventure_manager) {
        throw new Error(
          `OfferOfService with ID ${oosId} is not a manager for Adventure with ID ${adventureId}`
        );
      }

      await knex('adventure_manager')
        .where({ adventure_id: adventureId, oos_id: oosId })
        .del();

      const Adventure = await knex('adventure')
        .select(selectAllWithTypeField('Adventure'))
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
      .select(selectAllWithTypeField('Patrol'))
      .whereIn('workflowState', workflowState)
      .modify(nameFilter, name)
      .modify(fullyPaidFilter, fullyPaid);
  },

  getPatrol({ searchField, value }) {
    return knex('patrol')
      .select(selectAllWithTypeField('Patrol'))
      .where(whereSearchField({ searchField, value }))
      .first();
  },

  getScoutersForPatrol({ id }) {
    return knex('patrol_scouter').where({
      patrol_id: id,
    });
  },

  getPatrolScouter({ searchField, value }) {
    return knex('patrol_scouter')
      .select(selectAllWithTypeField('PatrolScouter'))
      .where(whereSearchField({ searchField, value }))
      .first();
  },

  getAllPatrolScouters({ workflowState = 'active', name, patrolNumber }) {
    const nameFilter = (qb, name) => {
      if (name === undefined) return;
      qb
        .where('firstName', 'ilike', `${name}%`)
        .orWhere('lastName', 'ilike', `${name}%`);
    };

    const patrolNumberFilter = (qb, patrolNumber) => {
      if (patrolNumber === undefined) return;
      qb.where(
        'patrol_id',
        knex.raw(
          `(SELECT id FROM patrol WHERE patrol_number = '${patrolNumber}')`
        )
      );
    };

    return knex('patrol_scouter')
      .select(selectAllWithTypeField('PatrolScouter'))
      .whereIn('workflowState', workflowState)
      .modify(nameFilter, name)
      .modify(patrolNumberFilter, patrolNumber);
  },
};
