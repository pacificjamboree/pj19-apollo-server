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
      (acc, curr) => {
        const { scouts, scouters, total } = acc;
        const { numberOfScouts, numberOfScouters } = curr;
        return {
          scouts: scouts + numberOfScouts,
          scouters: scouters + numberOfScouters,
          total: total + numberOfScouts + numberOfScouters,
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
