exports.up = (knex, Promise) =>
  knex.schema.renameTable('adventure_managers', 'adventure_manager');

exports.down = (knex, Promise) =>
  knex.schema.renameTable('adventure_manager', 'adventure_managers');
