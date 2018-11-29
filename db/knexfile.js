const path = require('path');
const configPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: configPath });

const baseConnection = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: false,
};
const baseConfig = {
  client: 'pg',
  connection: { ...baseConnection },
};

module.exports = {
  test: {
    ...baseConfig,
    connection: {
      ...baseConnection,
      database: 'pjtest',
    },
    migrations: {
      directory: './migrations',
    },
  },
  development: {
    ...baseConfig,
    migrations: {
      stub: 'migration.stub',
    },
    seeds: {
      directory: './seeds/development',
    },
  },
  production: {
    ...baseConfig,
    seeds: {
      directory: './seeds/production',
    },
  },
};
