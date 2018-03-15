const jwt = require('jsonwebtoken');
const { ECUSTOM } = require('../errors');

module.exports = user => {
  const { username, oosId, patrolScouterId } = user;
  const { JWT_SECRET, JWT_EXP } = process.env;

  if (!JWT_SECRET) {
    throw new ECUSTOM('Error generating token', 500, 'EJWTERROR');
  }

  const sub = {
    username,
    oosId,
    patrolScouterId,
  };

  return jwt.sign(
    {
      sub,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXP || '24h',
    }
  );
};
