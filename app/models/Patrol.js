const Model = require('./BaseModel');

class Patrol extends Model {
  static get tableName() {
    return 'patrol';
  }

  static get relationMappings() {
    const PatrolScouter = require('./PatrolScouter');
    return {
      patrolScouters: {
        relation: Model.HasManyRelation,
        modelClass: PatrolScouter,
        join: { from: 'patrol.id', to: 'patrol_scouter.patrolId' },
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
