const TABLE = 'oos';
exports.up = (knex, Promise) => {
  return knex.schema.alterTable(TABLE, t => {
    t.uuid('assigned_adventure_id').references('adventure.id');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.alterTable(TABLE, t => {
    t.dropForeign('assigned_adventure_id');
  });
};
