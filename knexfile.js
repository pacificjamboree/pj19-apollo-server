module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: false
    },
    migrations: {
      stub: 'migration.stub'
    },
    seeds: {
      directory: './seeds/development'
    }
  }
};
