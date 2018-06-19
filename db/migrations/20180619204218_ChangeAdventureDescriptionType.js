exports.up = (knex, Promise) =>
  knex.schema.alterTable('adventure', t => t.text('description').alter());

exports.down = (knex, Promise) =>
  knex.schema.alterTable('adventure', t => t.string('description').alter());
