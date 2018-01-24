exports.up = (knex, Promise) => {
  return knex.schema.alterTable('oos', t => {
    t.uuid('assignedAdventureId');
    t.foreign('assignedAdventureId').references('adventure.id');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.alterTable('oos', t => {
    t.dropForeign('assignedAdventureId');
  });
};
