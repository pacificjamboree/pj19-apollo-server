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
    .first();

module.exports = getOfferOfService;
