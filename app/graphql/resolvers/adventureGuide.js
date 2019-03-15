const dedent = require('dedent');
const { Adventure, TextContent } = require('../../models');

const sortByName = (a, b) => {
  if (a.fullName() < b.fullName()) return -1;
  if (a.fullName() > b.fullName()) return 1;
  return 0;
};

const adventureLabelTable = ({ periodsRequired, location, fee }) => {
  const formattedFee = fee ? `$${fee}` : 'None';
  const locationFormatted = location
    .replace(/^\w/, c => c.toUpperCase())
    .replace('site', '-site');

  const durationFormatted = duration => {
    switch (duration) {
      case 1:
        return 'Half Day Adventure';
      case 2:
        return 'Full Day Adventure';
      case 3:
        return 'Overnight Adventure';
      default:
        return '';
    }
  };
  return dedent`
    | Duration      | Location   | Additional Fee |
    | :------------ | :--------- | :------------- |
    | ${durationFormatted(
      periodsRequired
    )} | ${locationFormatted} | ${formattedFee} | 
  `;
};

const adventureToMarkdown = a => `
#### ${a.themeName ? `${a.themeName} (${a.name})` : a.name}  
${adventureLabelTable(a)}

${a.description}
`;

const generateAdventureGuideMarkdown = async () => {
  try {
    // Get the data we need
    const guide = await TextContent.query()
      .where({ title: 'adventure-guide' })
      .first();
    const adventures = await Adventure.query().where({
      workflowState: 'active',
      hidden: false,
    });
    const GROUP_A = adventures
      .filter(a => a.premiumAdventure)
      .sort(sortByName)
      .map(adventureToMarkdown)
      .join('\n\n');

    const GROUP_B = adventures
      .filter(a => !a.premiumAdventure && !a.fee)
      .sort(sortByName)
      .map(adventureToMarkdown)
      .join('\n\n');

    const GROUP_C = adventures
      .filter(a => !a.premiumAdventure && a.fee)
      .sort(sortByName)
      .map(adventureToMarkdown)
      .join('\n\n');

    const generatedMd = guide.body
      .replace(':::GROUP_A:::', GROUP_A)
      .replace(':::GROUP_B:::', GROUP_B)
      .replace(':::GROUP_C:::', GROUP_C);

    return {
      ...guide,
      body: generatedMd,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { generateAdventureGuideMarkdown };
