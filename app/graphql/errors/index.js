const { createError } = require('apollo-errors');

const UnknownError = createError('UnknownError', {
  message: 'An unknown error occurred',
});

const UnauthorizedQueryError = createError('UnauthorizedError', {
  message: 'You are not authorized to perform that query',
});

const UnauthorizedActionError = createError('UnauthorizedActionError', {
  message: 'You are not authorized to perform that action',
});

const AuthenticationRequiredError = createError('AuthenticationRequiredError', {
  message: 'You are not logged in',
});

const InvalidAuthenticationError = createError('InvalidAuthenticationError', {
  message: 'The credentials you provided cannot be determined to be authentic',
});

module.exports = {
  UnknownError,
  UnauthorizedQueryError,
  UnauthorizedActionError,
  AuthenticationRequiredError,
  InvalidAuthenticationError,
};
