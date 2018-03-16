const Model = require('./BaseModel');

class OfferOfService extends Model {
  static getTableName() {
    return 'oos';
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

module.exports = OfferOfService;
