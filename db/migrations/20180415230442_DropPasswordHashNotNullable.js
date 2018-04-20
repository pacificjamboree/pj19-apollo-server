exports.up = (knex, Promise) =>
  knex.schema.alterTable('user', t => {
    t
      .string('password_hash')
      .alter()
      .nullable();
  });

exports.down = (knex, Promise) =>
  knex.schema.alterTable('user', t => {
    t
      .string('password_hash')
      .alter()
      .notNullable();
  });
