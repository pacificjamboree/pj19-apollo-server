const { fromGlobalId } = require('graphql-relay-tools');

module.exports = ({ searchField, value }) => {
  switch (searchField) {
    case 'id':
      value = fromGlobalId(value).id;
      break;

    case '_id':
      searchField = 'id';
      break;

    default:
      searchField = searchField; // eslint-disable-line
      break;
  }
  return { [searchField]: value };
};
