const { fromGlobalId } = require('graphql-relay-tools');
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

  // translate oosId and patrolScouterId fields to DB IDs
  if (dbInput.hasOwnProperty('oosId')) {
    dbInput.oosId = fromGlobalId(dbInput.oosId).id;
  }
  if (dbInput.hasOwnProperty('patrolScouterId')) {
    dbInput.patrolScouterId = fromGlobalId(dbInput.patrolScouterId).id;
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
