const Model = require('./BaseModel');

class PatrolScouter extends Model {
  static getTableName() {
    return 'patrol_scouter';
  }

  static get relationMappings() {
    const Patrol = require('./Patrol');
    return {
      patrol: {
        relation: Model.HasOneRelation,
        modelClass: Patrol,
        join: { from: 'patrol_scouter.patrolId', to: 'patrol.id' },
      },
    };
  }
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

module.exports = PatrolScouter;
