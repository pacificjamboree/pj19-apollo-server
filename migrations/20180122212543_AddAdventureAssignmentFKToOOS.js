exports.up = (knex, Promise) => {
  return knex.schema.alterTable('oos', t => {
    t.uuid('assigned_adventure_id');
    t.foreign('assigned_adventure_id').references('adventure.id');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.alterTable('oos', t => {
    t.dropForeign('assigned_adventure_id');
  });
};
