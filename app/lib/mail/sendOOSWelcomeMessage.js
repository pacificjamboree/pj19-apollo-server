const htmlToText = require('html-to-text');
const addDays = require('date-fns/add_days');
const formatDate = require('date-fns/format');
const transporter = require('./smtp');

const { Adventure } = require('../../models');

module.exports = async oos => {
  try {
    const allAdventures = await Adventure.query()
      .eager('offersOfService')
      .where('workflowState', 'active');
    const adventures = allAdventures.filter(
      a => a.offersOfService.length < a.oosRequired
    );
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
      subject: `Welcome to the PJ 2019 Adventure Team (${name} - OOS ${oosNumber})`,
      html,
      text,
    };

    if (process.env.NODE_ENV === 'production' && isYouth && parentEmail) {
      messageOptions.cc = parentEmail;
      messageOptions.bcc = 'safescouting.pj@scouts.ca';
    }

    transporter.sendMail(messageOptions);
  } catch (e) {
    throw e;
  }
};
