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

  async participantsAssigned() {
    // get the patrols for the period
    const patrols = await this.$relatedQuery('patrols');
    return patrols.reduce(
      (acc, patrol) => {
        const { scouts, scouters, total } = acc;
        const { numberOfScouts } = patrol;
        return {
          scouts: scouts + numberOfScouts,
          scouters: scouters + 2, // only return 2 scouters even if patrol has 3
          total: total + numberOfScouts + 2,
        };
      },
      {
        scouts: 0,
        scouters: 0,
        total: 0,
      }
    );
  }
}

module.exports = AdventurePeriod;
