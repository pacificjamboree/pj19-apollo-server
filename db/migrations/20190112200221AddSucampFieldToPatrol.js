const TABLE = 'patrol';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.enu('subcamp', ['O', 'S', 'V']);
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('subcamp');
  });
