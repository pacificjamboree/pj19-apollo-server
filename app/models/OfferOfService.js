const Model = require('./BaseModel');

class OfferOfService extends Model {
  static get tableName() {
    return 'oos';
  }

  static get relationMappings() {
    const { Adventure, User } = require('./index');
    return {
      assignment: {
        relation: Model.BelongsToOneRelation,
        modelClass: Adventure,
        join: { from: 'oos.assignedAdventureId', to: 'adventure.id' },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'oos.id', to: 'user.oosId' },
      },
    };
  }

  assigned() {
    return !!this.assignedAdventureId;
  }

  async isAdventureManager() {
    if (!this.assignedAdventureId) return false;

    const extendedOOS = await this.$query().eager('assignment.managers');

    const { managers } = extendedOOS.assignment;
    return managers.map(({ id }) => id).includes(this.id);
  }

  fullName() {
    return `${this.preferredName ? this.preferredName : this.firstName} ${
      this.lastName
    }`;
  }
}

module.exports = OfferOfService;
