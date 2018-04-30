const { fromGlobalId } = require('graphql-relay-tools');
const bcrypt = require('bcrypt');
const { User } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const getUser = input =>
  User.query()
    .where(whereSearchField(input))
    .eager('[offerOfService, offerOfService.assignment, patrolScouter]')
    .first();

const createUser = async ({ User: input, clientMutationId }) => {
  // translate oosId and patrolScouterId fields to DB IDs
  if (Object.prototype.hasOwnProperty.call(input, 'oosId')) {
    input.oosId = fromGlobalId(input.oosId).id;
  }
  if (Object.prototype.hasOwnProperty.call(input, 'patrolScouterId')) {
    input.patrolScouterId = fromGlobalId(input.patrolScouterId).id;
  }

  // if `password` field present, replace with hash
  if (Object.prototype.hasOwnProperty.call(input, 'password')) {
    input.passwordHash = await User.hashPassword(input.password);
    delete input.password;
  }

  try {
    const user = await User.query()
      .insert(input)
      .returning('*');
    return {
      User: user,
    };
  } catch (e) {
    throw e;
  }
};

const updateUser = async input => {
  const dbInput = { ...input.User };
  delete dbInput.clientMutationId;

  // translate oosId and patrolScouterId fields to DB IDs
  if (dbInput.hasOwnProperty('oosId')) {
    dbInput.oosId = fromGlobalId(dbInput.oosId).id;
  }
  if (dbInput.hasOwnProperty('patrolScouterId')) {
    dbInput.patrolScouterId = fromGlobalId(dbInput.patrolScouterId).id;
  }

  try {
    const user = await User.query()
      .patch(dbInput)
      .where({ id: fromGlobalId(input.id).id })
      .returning('*')
      .first();

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
  updateUser,
};
