exports.up = (knex, Promise) =>
  knex.schema.alterTable('adventure', t => {
    t.string('adventure_code')
      .alter()
      .notNullable();
  });

exports.down = (knex, Promise) =>
  knex.schema.alterTable('adventure', t => {
    t.string('adventure_code')
      .alter()
      .nullable();
  });
