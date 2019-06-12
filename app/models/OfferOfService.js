const Model = require('./BaseModel');
const Adventure = require('./Adventure');
const { ref } = require('objection');

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

  async manages() {
    if (!this.assignedAdventureId) return [];
    const knex = Model.knex();

    const result = await knex.raw(
      'SELECT adventure_id FROM adventure_manager WHERE oos_id = ?',
      this.id
    );

    const ids = result.rows.map(r => r.adventure_id);
    if (!ids.length) {
      return [];
    }
    const ManagedAdventures = await Adventure.query().whereIn('id', ids);
    return ManagedAdventures;
  }

  fullName() {
    return `${this.preferredName ? this.preferredName : this.firstName} ${
      this.lastName
    }`;
  }
}

module.exports = OfferOfService;
