const Model = require('./BaseModel');

class OfferOfService extends Model {
  static get tableName() {
    return 'oos';
  }

  static get relationMappings() {
    const Adventure = require('./Adventure');
    return {
      assignment: {
        relation: Model.BelongsToOneRelation,
        modelClass: Adventure,
        join: { from: 'oos.assignedAdventureId', to: 'adventure.id' },
      },
    };
  }

  assigned() {
    return !!this.assignedAdventureId;
  }

  fullName() {
    return `${this.preferredName ? this.preferredName : this.firstName} ${
      this.lastName
    }`;
  }
}

module.exports = OfferOfService;
