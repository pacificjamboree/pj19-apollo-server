const {
  UnauthorizedActionError,
  AuthenticationRequiredError,
} = require('../errors');

module.exports = {
  isAuthenticated: (next, src, args, { user }) => {
    if (user) return next();
    throw new AuthenticationRequiredError();
  },
  isAuthorized: (next, src, { roles }, { user }) => {
    if (!user) throw new AuthenticationRequiredError();
    if (user.roles.includes(roles) || user.roles.includes('admin')) {
      return next();
    }
    throw new UnauthorizedActionError();
  },
};
