const Model = require('./BaseModel');

class Adventure extends Model {
  static get tableName() {
    return 'adventure';
  }

  static get relationMappings() {
    const OfferOfService = require('./OfferOfService');
    return {
      offersOfService: {
        relation: Model.HasManyRelation,
        modelClass: OfferOfService,
        join: { from: 'adventure.id', to: 'oos.assignedAdventureId' },
      },
      managers: {
        relation: Model.ManyToManyRelation,
        modelClass: OfferOfService,
        join: {
          from: 'adventure.id',
          through: {
            from: 'adventure_manager.adventure_id',
            to: 'adventure_manager.oos_id',
          },
          to: 'oos.id',
        },
      },
      periods: {
        relation: Model.HasManyRelation,
        modelClass: require('./AdventurePeriod'),
        join: {
          from: 'adventure.id',
          to: 'adventure_period.adventureId',
        },
      },
    };
  }

  fullName() {
    return `${this.themeName ? `${this.themeName} (${this.name})` : this.name}`;
  }
}

module.exports = Adventure;
