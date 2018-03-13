const jwt = require('jsonwebtoken');

module.exports = user => {
  const { username, oosId, patrolScouterId } = user;
  const { JWT_SECRET, JWT_EXP } = process.env;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
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
