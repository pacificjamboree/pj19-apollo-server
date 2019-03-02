const Model = require('./BaseModel');

class PatrolAdventureSelection extends Model {
  static get tableName() {
    return 'patrol_adventure_selection';
  }

  static get relationMappings() {
    const Patrol = require('./Patrol');
    return {
      patrol: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patrol,
        join: {
          from: 'patrol_adventure_selection.patrolId',
          to: 'patrol.id',
        },
      },
    };
  }
}

module.exports = PatrolAdventureSelection;
