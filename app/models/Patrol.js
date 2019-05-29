const differenceInHours = require('date-fns/difference_in_hours');
const Model = require('./BaseModel');

class Patrol extends Model {
  static get tableName() {
    return 'patrol';
  }

  static get relationMappings() {
    const PatrolScouter = require('./PatrolScouter');
    const PatrolAdventureSelection = require('./PatrolAdventureSelection');
    const AdventurePeriod = require('./AdventurePeriod');

    return {
      adventureSelection: {
        relation: Model.HasOneRelation,
        modelClass: PatrolAdventureSelection,
        join: { from: 'patrol.id', to: 'patrol_adventure_selection.patrolId' },
      },
      patrolScouter: {
        relation: Model.HasOneRelation,
        modelClass: PatrolScouter,
        join: { from: 'patrol.patrolScouterId', to: 'patrol_scouter.id' },
      },
      schedule: {
        relation: Model.ManyToManyRelation,
        modelClass: AdventurePeriod,
        join: {
          from: 'patrol.id',
          through: {
            from: 'patrol_schedule.patrolId',
            to: 'patrol_schedule.adventurePeriodId',
          },
          to: 'adventure_period.id',
        },
      },
    };
  }

  fullyPaid() {
    return !!this.finalPaymentDate;
  }

  totalUnitSize() {
    return this.numberOfScouts + this.numberOfScouters;
  }

  async hoursScheduled() {
    const schedule = await this.$relatedQuery('schedule');

    return schedule.reduce((acc, { startAt, endAt }) => {
      const hours = differenceInHours(endAt, startAt);
      return hours + acc;
    }, 0);
  }
}

module.exports = Patrol;
