const differenceInYears = require('date-fns/difference_in_years');
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

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isYouth() {
    return differenceInYears(new Date(), this.birthdate) <= 18;
  }
}

module.exports = OfferOfService;
