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
    .where(whereSearchField(input))
    .eager('assignment')
    .first();

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
