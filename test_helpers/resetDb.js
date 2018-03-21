const knex = require('../db');
const { resolve } = require('path');

const migrationOpts = {
  directory: resolve(`./db/migrations`),
};

module.exports = {
  async resetBefore() {
    await knex.migrate.rollback(migrationOpts);
    await knex.migrate.latest(migrationOpts);
  },
  async resetAfter() {
    await knex.migrate.rollback(migrationOpts);
  },

  async destroyDbConnection() {
    knex.destroy();
  },
};
