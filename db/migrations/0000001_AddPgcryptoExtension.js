exports.up = (knex, Promise) => {
  return knex.schema.raw('CREATE EXTENSION pgcrypto;');
};

exports.down = (knex, Promise) => {
  return knex.schema.raw('DROP EXTENSION pgcrypto;');
};
