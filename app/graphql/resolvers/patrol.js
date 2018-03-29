const { Patrol } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const getPatrol = input =>
  Patrol.query()
    .where(whereSearchField(input))
    .eager('patrolScouters')
    .first();

const getPatrols = ({ workflowState = 'active', name, fullyPaid }) => {
  const nameFilter = (qb, name) => {
    if (name !== undefined) {
      qb.where('name', 'ilike', `%${name}%`);
    }
  };

  const fullyPaidFilter = (qb, fullyPaid) => {
    if (fullyPaid === undefined) return;
    const FIELD = 'final_payment_received';
    fullyPaid ? qb.whereNotNull(FIELD) : qb.whereNull(FIELD);
  };

  return Patrol.query()
    .whereIn('workflowState', workflowState)
    .modify(nameFilter, name)
    .modify(fullyPaidFilter, fullyPaid);
};

module.exports = {
  getPatrol,
  getPatrols,
};
