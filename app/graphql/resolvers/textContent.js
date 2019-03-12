const { TextContent } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const getTextContent = input =>
  TextContent.query()
    .where(whereSearchField(input))
    .eager('revisions')
    .first();

const updateTextContent = async ({ title, TextContent: input }) => {
  try {
    const textContent = await TextContent.query()
      .where({ title })
      .patch(input)
      .returning('*')
      .first();

    return { TextContent: textContent };
  } catch (error) {
    throw error;
  }
};

module.exports = { getTextContent, updateTextContent };
