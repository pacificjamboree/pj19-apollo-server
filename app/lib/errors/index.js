const EE = require('es6-error');
const { EINVALIDCREDENTIALS, ENOTAUTHORIZED } = require('./authErrors');

class ECUSTOM extends EE {
  constructor(message = '', code = 500, name = 'ECUSTOM') {
    super(message);
    this.code = code;
    this.name = name;
  }
}

module.exports = {
  ECUSTOM,
  EINVALIDCREDENTIALS,
  ENOTAUTHORIZED,
};
