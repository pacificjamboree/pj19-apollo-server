const { fromGlobalId } = require('graphql-relay-tools');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const whereSearchField = require('../../lib/whereSearchField');

const getUser = input =>
  User.query()
    .where(whereSearchField(input))
    .eager(
      '[offerOfService.assignment.[offersOfService, managers], patrolScouter]'
    )
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

const updateUser = async ({ User: input, id, clientMutationId }) => {
  // translate oosId and patrolScouterId fields to DB IDs
  if (Object.prototype.hasOwnProperty.call(input, 'oosId')) {
    input.oosId = fromGlobalId(input.oosId).id;
  }
  if (Object.prototype.hasOwnProperty.call(input, 'patrolScouterId')) {
    input.patrolScouterId = fromGlobalId(input.patrolScouterId).id;
  }

  try {
    const user = await User.query()
      .patch(input)
      .where({ id: fromGlobalId(id).id })
      .returning('*')
      .first();

    return {
      User: user,
    };
  } catch (e) {
    throw e;
  }
};

const resetPasswordForUser = async ({ passwordResetToken, password }) => {
  try {
    // decode the JWT and get the user id
    const decodedToken = jwt.verify(passwordResetToken, process.env.JWT_SECRET);
    const { id } = decodedToken.sub;
    // compare the JWT to the saved reset token, bail if different
    const user = await User.query()
      .where({ id })
      .first();
    if (user.passwordResetToken !== passwordResetToken) {
      throw new Error('Tokens no matchy');
    }

    // hash and set new password
    const passwordHash = await User.hashPassword(password);
    await user
      .$query()
      .patch({
        passwordHash,
        passwordResetToken: null,
        workflowState: 'active',
      });
    return {
      status: 'ok',
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  resetPasswordForUser,
};
