const TABLE = 'adventure_managers';
exports.up = (knex, Promise) =>
  knex.schema.alterTable(TABLE, t => {
    t.unique(['adventure_id', 'oos_id']);
  });

exports.down = (knex, Promise) => {
  knex.schema.alterTable(TABLE, t => {
    t.dropUnique(['adventure_id', 'oos_id']);
  });
};
