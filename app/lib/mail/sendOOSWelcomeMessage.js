const htmlToText = require('html-to-text');
const addDays = require('date-fns/add_days');
const formatDate = require('date-fns/format');
const transporter = require('./smtp');

const { Adventure } = require('../../models');

module.exports = async oos => {
  try {
    const allAdventures = await Adventure.query()
      .eager('offersOfService')
      .where('workflowState', 'active')
      .andWhere('hidden', false);
    const adventures = allAdventures
      .filter(a => a.offersOfService.length < a.oosRequired)
      .sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    const template = require('./messages/oosWelcomeMessage');
    const html = template({
      oos,
      adventures,
      dueDate: formatDate(addDays(new Date(), 10), 'dddd, MMMM D'),
    });
    const text = htmlToText.fromString(html, { ignoreImage: true });

    const {
      oosNumber,
      firstName,
      preferredName,
      lastName,
      email,
      isYouth,
      parentEmail,
    } = oos;
    const name = preferredName
      ? `${preferredName} ${lastName}`
      : `${firstName} ${lastName}`;
    const messageOptions = {
      to: { name: `${name}`, address: email },
      bcc: [process.env.SMTP_FROM_ADDRESS],
      subject: `Welcome to the PJ 2019 Adventure Team (${name} - OOS ${oosNumber} ${
        isYouth ? '(Y)' : ''
      })`,
      html,
      text,
    };

    if (process.env.NODE_ENV === 'production' && isYouth && parentEmail) {
      messageOptions.cc = parentEmail;
      messageOptions.bcc.push = 'safescouting.pj@scouts.ca';
    }

    await transporter.sendMail(messageOptions);
    await oos.$query().patch({ welcomeEmailSentAt: new Date() });
  } catch (e) {
    throw e;
  }
};
