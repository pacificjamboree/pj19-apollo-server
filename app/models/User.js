const bcrypt = require('bcrypt');
const Model = require('./BaseModel');

class User extends Model {
  static get tableName() {
    return 'user';
  }
  static get relationMappings() {
    const { OfferOfService, PatrolScouter } = require('./index');
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

  async setPassword(password, salt) {
    const passwordHash = await bcrypt.hash(password, 10);
    await this.$query()
      .patch({ passwordHash })
      .returning('*');
    return this;
  }

  async verifyPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }

  isAdmin() {
    return !!this.admin;
  }

  isOfferOfService() {
    return !!this.oosId;
  }

  async isAdventureManager() {
    if (!this.oosId) {
      return false;
    }
    const extendedUser = await this.$query().eager(
      '[offerOfService, offerOfService.assignment.managers]'
    );

    if (!extendedUser.offerOfService.assignment) {
      return false;
    }

    const { managers } = extendedUser.offerOfService.assignment;
    return managers.map(({ id }) => id).includes(this.oosId);
  }

  isPatrolScouter() {
    return !!this.patrolScouterId;
  }
}

module.exports = User;
