const bcrypt = require('bcrypt');
const Model = require('./BaseModel');

const makeHash = async password => await bcrypt.hash(password, 10);

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

  static async hashPassword(password) {
    return await makeHash(password);
  }

  async setPassword(password) {
    const passwordHash = await makeHash(password);
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

  async calculateRoles() {
    const roleValues = {
      admin: 0,
      adventureManager: 1,
      offerOfService: 2,
      patrolScouter: 3,
      user: 4,
    };
    let roles = ['user'];

    if (this.isOfferOfService()) roles.push('offerOfService');
    if (this.isPatrolScouter()) roles.push('patrolScouter');
    if (await this.isAdventureManager()) roles.push('adventureManager');
    if (this.isAdmin()) roles.push('admin');

    return roles.sort((a, b) => roleValues[a] - roleValues[b]);
  }
}

module.exports = User;
