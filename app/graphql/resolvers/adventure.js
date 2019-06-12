const { toGlobalId, fromGlobalId } = require('graphql-relay-tools');
const { Adventure } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');
const { selectOfferOfService } = require('./offerOfService');

const {
  queues: { ADVENTURE_GUIDE_PDF },
} = require('../../queues');

const ADVENTURE_EAGERS = '[offersOfService, managers]';

const getAdventure = input => {
  if (input.searchField === 'id') {
    // this is here because at one point the welcome email
    // was sent using the DB ID as the URL slug,
    // and not the global-unique ID.

    // if the "id" is a UUID, convert it to the global id
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (input.value.match(re)) {
      input.value = toGlobalId('Adventure', input.value);
    }
  }

  return Adventure.query()
    .where(whereSearchField(input))
    .eager(ADVENTURE_EAGERS)
    .first();
};

const getAdventures = async ({
  workflowState = ['active'],
  location = ['onsite', 'offsite'],
  premiumAdventure,
  name,
  themeName,
  hidden = false,
}) => {
  const premiumActivityFilter = (qb, premiumAdventure) => {
    if (premiumAdventure) {
      qb.andWhere('premiumAdventure', premiumAdventure);
    }
  };

  const nameFilter = (qb, name, themeName) => {
    if (name || themeName) {
      qb.where('name', 'ilike', `%${name}%`).orWhere(
        'theme_name',
        'ilike',
        `%${themeName}%`
      );
    }
  };

  const hiddenFilter = (qb, hidden) => {
    qb.andWhere('hidden', hidden);
  };

  return Adventure.query()
    .eager(ADVENTURE_EAGERS)
    .whereIn('workflowState', workflowState)
    .whereIn('location', location)
    .modify(hiddenFilter, hidden)
    .modify(premiumActivityFilter, premiumAdventure)
    .modify(nameFilter, name, themeName);
};

const createAdventure = async ({ Adventure: input, clientMutationId }) => {
  ['pdrPlan', 'pdrDo', 'pdrReview', 'pdrSafetyTips'].forEach(x => {
    if (input[x]) {
      input[x] = JSON.stringify(input[x]);
    }
  });
  try {
    const adventure = await Adventure.query()
      .insert(input)
      .returning('*');

    // queue adventure guide pdf generation
    ADVENTURE_GUIDE_PDF.add();

    return {
      Adventure: adventure,
    };
  } catch (e) {
    throw e;
  }
};

const updateAdventure = async ({ id, Adventure: input, clientMutationId }) => {
  ['pdrPlan', 'pdrDo', 'pdrReview', 'pdrSafetyTips'].forEach(x => {
    if (input[x]) {
      input[x] = JSON.stringify(input[x]);
    }
  });

  try {
    const adventure = await Adventure.query()
      .where({ id: fromGlobalId(id).id })
      .patch(input)
      .eager('managers')
      .returning('*')
      .first();

    // queue adventure guide pdf generation
    ADVENTURE_GUIDE_PDF.add();

    return {
      Adventure: adventure,
    };
  } catch (e) {
    throw e;
  }
};

const assignManagerToAdventure = async input => {
  const adventureId = fromGlobalId(input.adventureId).id;
  const oosId = fromGlobalId(input.oosId).id;
  try {
    /* 
      an offer of service can be a manager if:
        - active OOS (not defined or deleted)
        - is assigned to the Adventure
    */

    const oos = await selectOfferOfService(oosId);
    if (oos.workflowState !== 'active') {
      throw new Error('OfferOfService must be active to be a Manager');
    }

    if (!oos.assigned()) {
      throw new Error(
        'Offer of Service must be assigned to an Adventure to be a Manager'
      );
    }

    if (oos.assignedAdventureId !== adventureId) {
      throw new Error(
        'Offer of Service must be assigned to the target Adventure to be a Manager'
      );
    }
    const knex = Adventure.knex();
    await knex('adventure_manager')
      .insert({
        oosId,
        adventureId,
      })
      .returning('*');

    const adventure = await Adventure.query()
      .where({ id: adventureId })
      .eager('managers')
      .first();

    return {
      Adventure: adventure,
    };
  } catch (e) {
    throw e;
  }
};

const removeManagerFromAdventure = async input => {
  const knex = Adventure.knex();
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

    const adventure = await Adventure.query()
      .where('id', adventureId)
      .eager('[offersOfService, managers]')
      .first();
    return {
      Adventure: adventure,
    };
  } catch (e) {
    throw e;
  }
};
module.exports = {
  getAdventure,
  getAdventures,
  createAdventure,
  updateAdventure,
  assignManagerToAdventure,
  removeManagerFromAdventure,
};
