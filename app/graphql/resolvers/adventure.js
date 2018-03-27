const { fromGlobalId } = require('graphql-relay-tools');
const { Adventure } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');
const { selectOfferOfService } = require('./offerOfService');

const ADVENTURE_EAGERS = '[offersOfService, managers]';

const getAdventure = input =>
  Adventure.query()
    .where(whereSearchField(input))
    .eager(ADVENTURE_EAGERS)
    .first();

const getAdventures = ({
  workflowState = 'active',
  location = ['onsite', 'offsite'],
  premiumAdventure,
  name,
  themeName,
}) => {
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

  return Adventure.query()
    .eager(ADVENTURE_EAGERS)
    .whereIn('workflowState', workflowState)
    .whereIn('location', location)
    .modify(premiumActivityFilter, premiumAdventure)
    .modify(nameFilter, name, themeName);
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

    if (
      !oos.assigned() ||
      (oos.assigned() && oos.assignedAdventureId !== adventureId)
    ) {
      throw new Error(
        'Offer of Service must be assigned to an Adventure to be a Manager'
      );
    }
  } catch (e) {
    throw e;
  }
};
module.exports = { getAdventure, getAdventures, assignManagerToAdventure };
