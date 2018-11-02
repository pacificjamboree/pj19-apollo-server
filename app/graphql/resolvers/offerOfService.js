const { transaction } = require('objection');
const { OfferOfService } = require('../../models');
const { fromGlobalId } = require('graphql-relay-tools');
const whereSearchField = require('../../lib/whereSearchField');

const selectOfferOfService = async id => {
  try {
    const oos = await OfferOfService.query()
      .findById(id)
      .eager('assignment.[offersOfService]')
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
    .eager(
      'assignment.[offersOfService]' /*[assignment, assignment.offersOfService]'*/
    );

const getOffersOfService = ({
  workflowState = ['active'],
  assigned,
  email,
  name,
  importId,
}) => {
  const assignedFilter = (qb, assigned) => {
    if (assigned === undefined) return;
    const FIELD = 'assigned_adventure_id';
    /* istanbul ignore next */
    assigned ? qb.whereNotNull(FIELD) : qb.whereNull(FIELD);
  };

  const emailFilter = (qb, email) => {
    if (email !== undefined) {
      qb.andWhere({ email });
    }
  };

  const nameFilter = (qb, name) => {
    if (name !== undefined) {
      qb.where('firstName', 'ilike', `${name}%`).orWhere(
        'lastName',
        'ilike',
        `${name}%`
      );
    }
  };

  const importIdFilter = (qb, importId) => {
    if (importId !== undefined) {
      qb.andWhere({ importId });
    }
  };
  return OfferOfService.query()
    .whereIn('workflowState', workflowState)
    .modify(assignedFilter, assigned)
    .modify(emailFilter, email)
    .modify(nameFilter, name)
    .modify(importIdFilter, importId)
    .eager('assignment')
    .orderBy('oosNumber');
};

const createOfferOfService = async ({
  OfferOfService: input,
  clientMutationId,
}) => {
  try {
    const oos = await OfferOfService.query()
      .insert(input)
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
    /* istanbul ignore next */
    throw e;
  }
};

const changeAssignment = async input => {
  const id = fromGlobalId(input.oosId).id;
  let { adventureId } = input;
  /* istanbul ignore next */
  if (adventureId !== null) {
    adventureId = fromGlobalId(adventureId).id;
  }
  try {
    let oos = await selectOfferOfService(id);

    // if we're trying to assign the OOS to the same adventure, just return
    if (oos.assignedAdventureId === adventureId) {
      return { OfferOfService: oos };
    }

    // if the OOS is manager of a different adventure, throw
    if (oos.assigned() && oos.assignment.managers.length) {
      const managerIds = oos.assignment.managers.map(m => m.id);
      /* istanbul ignore next */
      if (managerIds.includes(id)) {
        throw new Error(
          `Can not reassign OfferOfService with ID ${id} as they are an Adventure Manager.`
        );
      }
    }

    oos = await oos
      .$query()
      .patchAndFetch({ assignedAdventureId: adventureId })
      .returning('*')
      .eager('assignment')
      .first();
    return { OfferOfService: oos };
  } catch (e) {
    throw e;
  }
};

const updateOfferOfService = async input => {
  const id = fromGlobalId(input.id).id;
  const { OfferOfService: payload } = input;

  try {
    let oos = await selectOfferOfService(id);
    oos = await oos
      .$query()
      .patch(payload)
      .returning('*')
      .eager('assignment')
      .first();

    return { OfferOfService: oos };
  } catch (e) {
    /* istanbul ignore next */
    throw e;
  }
};

const batchImportOffersOfService = async ({ OffersOfService }) => {
  console.log(OffersOfService);
  try {
    const oos = await OfferOfService.query()
      .insert(OffersOfService)
      .returning('*');
    console.log(oos);
    return { offersOfService: oos };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  selectOfferOfService,
  getOfferOfService,
  getOffersOfService,
  createOfferOfService,
  toggleWorkflowState,
  changeAssignment,
  updateOfferOfService,
  batchImportOffersOfService,
};
