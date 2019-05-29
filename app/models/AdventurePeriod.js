const Model = require('./BaseModel');
const Adventure = require('./Adventure');
const Patrol = require('./Patrol');

class AdventurePeriod extends Model {
  static get tableName() {
    return 'adventure_period';
  }

  static get relationMappings() {
    return {
      adventure: {
        relation: Model.BelongsToOneRelation,
        modelClass: Adventure,
        join: {
          from: 'adventure_period.adventureId',
          to: 'adventure.id',
        },
      },
      patrols: {
        relation: Model.ManyToManyRelation,
        modelClass: Patrol,
        join: {
          from: 'adventure_period.id',
          through: {
            from: 'patrol_schedule.adventurePeriodId',
            to: 'patrol_schedule.patrolId',
          },
          to: 'patrol.id',
        },
      },
    };
  }
}

module.exports = AdventurePeriod;
