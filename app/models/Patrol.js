const Model = require('./BaseModel');

class Patrol extends Model {
  static get tableName() {
    return 'patrol';
  }

  static get relationMappings() {
    const PatrolScouter = require('./PatrolScouter');
    return {
      patrolScouter: {
        relation: Model.HasOneRelation,
        modelClass: PatrolScouter,
        join: { from: 'patrol.patrolScouterId', to: 'patrol_scouter.id' },
      },
    };
  }

  fullyPaid() {
    return !!this.finalPaymentReceived;
  }

  totalUnitSize() {
    return this.numberOfScouts + this.numberOfScouters;
  }
}

module.exports = Patrol;
