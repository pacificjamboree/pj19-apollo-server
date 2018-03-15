const EE = require('es6-error');

class EINVALIDCREDENTIALS extends EE {
  constructor(
    message = `The credentials you provided cannot be determined to be authentic`
  ) {
    super(message);
    this.code = 401;
  }
}

class ENOTAUTHORIZED extends EE {
  constructor(message = `You are not authorized to perform that action`) {
    super(message);
    this.code = 403;
  }
}

module.exports = {
  EINVALIDCREDENTIALS,
  ENOTAUTHORIZED,
};
