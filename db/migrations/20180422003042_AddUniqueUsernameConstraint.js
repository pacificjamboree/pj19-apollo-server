const TABLE = 'user';
exports.up = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.unique('username');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropUnique('username');
  });
