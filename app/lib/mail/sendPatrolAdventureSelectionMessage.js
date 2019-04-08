const htmlToText = require('html-to-text');
const transporter = require('./smtp');

const { Adventure, PatrolAdventureSelection } = require('../../models');

module.exports = async ({ id }) => {
  try {
    let adventureSelection = await PatrolAdventureSelection.query()
      .where({ id })
      .eager('patrol.[patrolScouter]')
      .first();

    const promises = adventureSelection.selectionOrder.map(async a => {
      return Adventure.query()
        .where({ id: a })
        .first();
    });

    adventureSelection.selectionOrder = await Promise.all(promises);

    const template = require('./messages/patrolAdventureSelectionMessage');
    const html = template(adventureSelection);
    const text = htmlToText.fromString(html, { ignoreImage: true });

    const messageOptions = {
      to: { address: adventureSelection.patrol.patrolScouter.email },
      bcc: [process.env.SMTP_FROM_ADDRESS],
      subject: `PJ 2019 Adventure Selection - Patrol ${
        adventureSelection.patrol.patrolNumber
      }`,
      html,
      text,
    };

    await transporter.sendMail(messageOptions);
  } catch (error) {
    throw error;
  }
};
