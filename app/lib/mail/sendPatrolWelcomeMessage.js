const htmlToText = require('html-to-text');
const transporter = require('./smtp');
const template = require('./messages/patrolWelcomeMessage');

module.exports = async ({ to }) => {
  try {
    const html = template();
    const text = htmlToText.fromString(html, { ignoreImage: true });
    const messageOptions = {
      to: [to],
      bcc: [process.env.SMTP_FROM_ADDRESS],
      subject: `PJ 2019 Adventure Website Access - Adventure Selection`,
      html,
      text,
    };
    await transporter.sendMail(messageOptions);
  } catch (error) {
    throw error;
  }
};
