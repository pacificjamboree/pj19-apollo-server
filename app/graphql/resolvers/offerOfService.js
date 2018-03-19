const { OfferOfService } = require('../../models');
const { fromGlobalId } = require('graphql-relay-tools');
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

module.exports = getOfferOfService;
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
