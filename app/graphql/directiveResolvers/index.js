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
    if (user.roles.includes('admin')) return next();
    if (roles.some(role => user.roles.includes(role))) return next();
    throw new UnauthorizedActionError();
  },
  managerOnly: (next, src, args, { user }) => {
    // must be logged in
    // may be admin
    // must have adventureManager role
    // must be manager for this adventure
    if (!user) throw new AuthenticationRequiredError();
    if (user.roles.includes('admin')) return next();
    if (!user.roles.includes('adventureManager')) {
      throw new UnauthorizedActionError();
    }
    const managerIds = src.managers.map(m => m.id);
    if (managerIds.includes(user.oosId)) return next();
    throw new UnauthorizedActionError();
  },
  adminOnly: (next, src, args, { user }) => {
    if (user.roles.includes('admin')) return next();
    // throw new UnauthorizedActionError();
  },
};
