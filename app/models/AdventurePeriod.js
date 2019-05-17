const Model = require('./BaseModel');
const Adventure = require('./Adventure');

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
    };
  }
}

module.exports = AdventurePeriod;
