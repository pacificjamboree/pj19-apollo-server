const { Model } = require('objection');
const db = require('../../db');
Model.knex(db);

class User extends Model {
  static get tableName() {
    return 'user';
  }
  static get relationMappings() {
    return {
      offerOfService: {
        relation: Model.BelongsToOneRelation,
        modelClass: OfferOfService,
        join: { from: 'user.oosId', to: 'oos.id' },
      },
      patrolScouter: {
        relation: Model.BelongsToOneRelation,
        modelClass: PatrolScouter,
        join: { from: 'user.patrolScouterId', to: 'patrol_scouter.id' },
      },
    };
  }
}

class OfferOfService extends Model {
  static getTableName() {
    return 'oos';
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

class PatrolScouter extends Model {
  static getTableName() {
    return 'patrol_scouter';
  }
}

module.exports = {
  User,
  OfferOfService,
};
