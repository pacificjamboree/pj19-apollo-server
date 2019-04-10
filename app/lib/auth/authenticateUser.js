const { User } = require('../../models');

const { EINVALIDCREDENTIALS } = require('../errors');

const getUser = username =>
  User.query()
    .whereRaw('LOWER(username) = ?', username.toLowerCase())
    .first();

module.exports = async (username, password) => {
  if (!username || !password) {
    throw new EINVALIDCREDENTIALS(
      '`username` and `password` are required fields'
    );
  }
  try {
    const user = await getUser(username);

    if (!user || user.workflowState != 'active') {
      throw new EINVALIDCREDENTIALS();
    }

    const passwordValid = await user.verifyPassword(password);
    if (passwordValid) {
      return user;
    } else {
      throw new EINVALIDCREDENTIALS();
    }
  } catch (e) {
    throw e;
  }
};
