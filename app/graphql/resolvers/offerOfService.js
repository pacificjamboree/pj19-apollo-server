const { transaction } = require('objection');
const { OfferOfService } = require('../../models');
const { fromGlobalId } = require('graphql-relay-tools');
const whereSearchField = require('../../lib/whereSearchField');

const selectOfferOfService = async id => {
  try {
    const oos = await OfferOfService.query()
      .findById(id)
      .eager('[assignment, assignment.managers]')
      .first();
    if (!oos) {
      throw new Error(`No Offer of Service with ID ${id} exists`);
    }
    return oos;
  } catch (e) {
    throw e;
  }
};

const getOfferOfService = input =>
  OfferOfService.query()
    .findOne(whereSearchField(input))
    .eager('assignment');

const getOffersOfService = ({
  workflowState = 'active',
  assigned,
  email,
  name,
}) => {
  const assignedFilter = (qb, assigned) => {
    if (assigned === undefined) return;
    const FIELD = 'assigned_adventure_id';

    assigned ? qb.whereNotNull(FIELD) : qb.whereNull(FIELD);
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
  return OfferOfService.query()
    .whereIn('workflowState', workflowState)
    .modify(assignedFilter, assigned)
    .modify(emailFilter, email)
    .modify(nameFilter, name)
    .eager('assignment');
};

const createOfferOfService = async input => {
  const dbinput = { ...input };
  delete dbinput.clientMutationId;
  try {
    const oos = await OfferOfService.query()
      .insert(dbinput)
      .returning('*');
    return {
      OfferOfService: oos,
    };
  } catch (e) {
    throw e;
  }
};

const toggleWorkflowState = async input => {
  const knex = OfferOfService.knex();
  const { workflowState } = input;
  const { id } = fromGlobalId(input.id);
  const update = { workflowState };

  // if an OfferOfService is being deleted, un-assign it from an Adventure
  if (workflowState === 'deleted') {
    update['assignedAdventureId'] = null;
  }

  try {
    const result = await transaction(knex, async t => {
      // update the OfferOfService record
      const oos = await OfferOfService.query()
        .patch(update)
        .where('id', id)
        .returning('*')
        .eager('assignment')
        .first();

      //  if an OfferOfService is being deleted, remove it from adventure_manager
      if (workflowState === 'deleted') {
        // there is no AdventureManager model so using raw knex
        await knex('adventure_manager')
          .transacting(t)
          .where({ oos_id: oos.id })
          .del();
      }
      return { OfferOfService: oos };
    });
    return result;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getOfferOfService,
  getOffersOfService,
  createOfferOfService,
  toggleWorkflowState,
};
