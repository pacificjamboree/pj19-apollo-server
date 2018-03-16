const Model = require('./BaseModel');

class PatrolScouter extends Model {
  static getTableName() {
    return 'patrol_scouter';
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

module.exports = PatrolScouter;
