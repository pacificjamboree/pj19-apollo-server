const Model = require('./BaseModel');

class PatrolScouter extends Model {
  static getTableName() {
    return 'patrol_scouter';
  }

  static get relationMappings() {
    const Patrol = require('./Patrol');
    return {
      patrols: {
        relation: Model.HasManyRelation,
        modelClass: Patrol,
        join: { from: 'patrol_scouter.id', to: 'patrol.patrolScouterId' },
      },
    };
  }
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

module.exports = PatrolScouter;
