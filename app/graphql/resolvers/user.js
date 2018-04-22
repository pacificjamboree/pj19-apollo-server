const bcrypt = require('bcrypt');
const { User } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const getUser = input =>
  User.query()
    .where(whereSearchField(input))
    .eager('[offerOfService, offerOfService.assignment, patrolScouter]')
    .first();

const createUser = async input => {
  const dbInput = { ...input };
  delete dbInput.clientMutationId;

  // if input includes password, replace it with a hash
  if (dbInput.password) {
    dbInput.passwordHash = await bcrypt.hash(dbInput.password, 10);
    delete dbInput.password;
  }
  try {
    const user = await User.query()
      .insert(dbInput)
      .returning('*');
    return {
      User: user,
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getUser,
  createUser,
};
