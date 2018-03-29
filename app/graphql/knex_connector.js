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

const selectAllWithTypeField = type => knex.raw(`*, '${type}' as "$type"`);

module.exports = {
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
};
