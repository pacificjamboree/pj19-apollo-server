const differenceInMinutes = require('date-fns/difference_in_minutes');
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
    const schedule = await this.$relatedQuery('schedule').eager('adventure');
    // stem_spheros and stem_escape_room overlap - remove one
    const filtered = schedule.filter(
      period => period.adventure.adventureCode !== 'stem_spheros'
    );
    const hours =
      filtered.reduce((acc, { startAt, endAt }) => {
        const hours = differenceInMinutes(endAt, startAt);
        return hours + acc;
      }, 0) / 60;

    // a patrol can technically be over 33 hours because of the way archery's stem periods overlap
    if (hours > 33) {
      return 33;
    }
    return hours;
  }

  async numberOfFreePeriods() {
    // returns the number of free periods assigned to the patrol
    // instances of `free1` are counted as one free period
    const FREE_PERIOD_CODES = ['free', 'free1'];
    const schedule = await this.$relatedQuery('schedule').eager('adventure');
    const freePeriods = schedule
      .filter(p => FREE_PERIOD_CODES.includes(p.adventure.adventureCode))
      .map(p => p.adventure.adventureCode);
    let hasHadFree1 = false;
    return freePeriods.reduce((prev, currentPeriod) => {
      if (currentPeriod === 'free') {
        return prev + 1;
      } else if (currentPeriod === 'free1') {
        if (hasHadFree1) {
          return prev;
        } else {
          hasHadFree1 = true;
          return prev + 1;
        }
      }
    }, 0);
  }
}

module.exports = Patrol;
