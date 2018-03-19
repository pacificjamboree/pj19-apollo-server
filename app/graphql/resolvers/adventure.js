const { Adventure } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');
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

module.exports = { getAdventure, getAdventures };
