const TABLE = 'patrol';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.text('group_name');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('group_name');
  });
