const knex = require('../db');
const bcrypt = require('bcrypt');

const getUser = username =>
  knex('user')
    .select('*')
    .where({ username })
    .first();

module.exports = async (username, password) => {
  if (!username || !password) {
    throw new Error('`username` and `password` are required fields');
  }
  try {
    const user = await getUser(username);

    if (!user || user.workflowState != 'active') {
      throw new Error('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (passwordValid) {
      const retUser = Object.assign({}, user);
      delete retUser.passwordHash;
      return retUser;
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (e) {
    throw e;
  }
};
