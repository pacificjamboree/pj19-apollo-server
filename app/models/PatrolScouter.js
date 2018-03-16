const Model = require('./BaseModel');

class PatrolScouter extends Model {
  static getTableName() {
    return 'patrol_scouter';
  }
}

module.exports = PatrolScouter;
