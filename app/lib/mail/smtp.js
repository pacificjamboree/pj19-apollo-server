const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_MODE,
  SMTP_FROM_NAME,
  SMTP_FROM_ADDRESS,
  SMTP_USER,
  SMTP_PASSWORD,
} = process.env;
const options = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_MODE === 'secure',
  debug: true,
  logger: true,
  tls: {
    rejectUnauthorized: false,
  },
};

if (SMTP_USER && SMTP_PASSWORD) {
  options.auth = {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  };
}
const transporter = nodemailer.createTransport(options, {
  from: { name: SMTP_FROM_NAME, address: SMTP_FROM_ADDRESS },
});
module.exports = transporter;
