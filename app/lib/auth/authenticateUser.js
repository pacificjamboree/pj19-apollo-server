const { User } = require('../../models');

const { EINVALIDCREDENTIALS } = require('../errors');

const getUser = username =>
  User.query()
    .where({ username })
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
      const retUser = Object.assign({}, user);
      delete retUser.passwordHash;
      return retUser;
    } else {
      throw new EINVALIDCREDENTIALS();
    }
  } catch (e) {
    throw e;
  }
};
