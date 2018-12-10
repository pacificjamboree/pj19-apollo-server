const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const generatePasswordResetToken = async user => {
  const issuer = 'PASSWORD_RESET';
  const sub = {
    id: user.id,
    username: user.username,
  };
  const exp = Date.now() + 3600000;
  const token = jwt.sign({ sub, exp }, JWT_SECRET, { issuer });
  await user.$query().update({ passwordResetToken: token });
  return token;
};

module.exports = generatePasswordResetToken;
