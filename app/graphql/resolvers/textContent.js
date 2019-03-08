const { TextContent } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const getTextContent = input =>
  TextContent.query()
    .where(whereSearchField(input))
    .eager('revisions')
    .first();

module.exports = { getTextContent };
