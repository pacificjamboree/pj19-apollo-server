const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { ECUSTOM } = require('../errors');

module.exports = async user => {
  const { id, username, oosId, patrolScouterId } = user;
  const { JWT_SECRET, JWT_EXP } = process.env;

  if (!JWT_SECRET) {
    throw new ECUSTOM('Error generating token', 500, 'EJWTERROR');
  }

  const sub = {
    id,
    username,
    oosId,
    patrolScouterId,
  };

  const toHash = user.id + user.username + user.passwordHash;
  const sha = crypto
    .createHash('sha256')
    .update(toHash)
    .digest('base64');

  const issuer = await bcrypt.hash(sha, 10);
  return jwt.sign(
    {
      sub,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXP || '24h',
      issuer,
    }
  );
};
