const TABLE = 'adventure';
exports.up = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.unique('adventure_code');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropUnique('adventure_code');
  });
