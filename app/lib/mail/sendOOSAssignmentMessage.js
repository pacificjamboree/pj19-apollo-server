const htmlToText = require('html-to-text');
const transporter = require('./smtp');

module.exports = async oos => {
  try {
    const assignment = await oos.$relatedQuery('assignment').eager('managers');
    oos.assignment = assignment;
    const html = require('./messages/oosAssignmentMessage')(oos);
    const text = htmlToText.fromString(html, { ignoreImage: true });

    const {
      firstName,
      lastName,
      preferredName,
      oosNumber,
      isYouth,
      parentEmail,
      email,
    } = oos;

    const name = preferredName
      ? `${preferredName} ${lastName}`
      : `${firstName} ${lastName}`;

    const cc = oos.assignment.managers.map(m => ({
      name: `${m.preferredName || m.firstName} ${m.lastName}`,
      address: m.email,
    }));

    const messageOptions = {
      to: { name, address: email },
      cc,
      subject: `PJ 2019 Program Offer of Service Assignment (${name} - OOS ${oosNumber})`,
      html,
      text,
    };

    if (process.env.NODE_ENV === 'production' && isYouth && parentEmail) {
      messageOptions.cc.push = parentEmail;
      messageOptions.bcc = 'safescouting.pj@scouts.ca';
    }
    transporter.sendMail(messageOptions);
  } catch (e) {
    throw e;
  }
};
