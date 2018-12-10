const htmlToText = require('html-to-text');
const dedent = require('dedent');
const transporter = require('./smtp');
const { BASE_URL } = process.env;

const messageText = `


`;

module.exports = async ({ user, token }) => {
  try {
    const { username } = user;
    const resetUrl = `${BASE_URL}/resetPassword/${token}`;
    const template = require('./messages/passwordResetMessage');
    const html = template({ resetUrl, username });
    const messageOptions = {
      to: { address: username },
      subject: 'PJ 2019 Adventure - Password Reset',
      html,
      text: dedent`
      Hello,

      We've received a request to reset your password for your "${username}" account on the
      2019 Pacific Jamboree Adventure site.

      Your passwor reset link is:
      ${resetUrl}
      
      This link is good for the next one hour and can only be
      used once.

      If you didn't make the request, just ignore this email or let us know. 
      Yourpassword won't change until you create a new password.

      Yours in Scouting,

      The PJ 2019 Adventure Team
      adventure@pacificjamboree.ca
      `,
    };
    transporter.sendMail(messageOptions);
  } catch (e) {
    throw e;
  }
};
