const { resolve } = require('path');
const knex = require('../db');
const knexfile = require('../db/knexfile');
const dbManager = require('knex-db-manager').databaseManagerFactory({
  knex: knexfile.test,
  dbManager: {
    superUser: 'postgres',
  },
});

const migrationOpts = {
  directory: resolve(`./db/migrations`),
};

const IGNORE_TABLES = ['knex_migrations', 'knex_migrations_lock'];

module.exports = {
  async resetBefore() {
    try {
      await dbManager.truncateDb(IGNORE_TABLES);
      await knex.migrate.latest(migrationOpts);
      await dbManager.close();
    } catch (e) {
      throw e;
    }
  },
  async resetAfter() {
    try {
      await dbManager.truncateDb(IGNORE_TABLES);
      await dbManager.close();
    } catch (e) {
      throw e;
    }
  },

  async destroyDbConnection() {
    knex.destroy();
  },
};
