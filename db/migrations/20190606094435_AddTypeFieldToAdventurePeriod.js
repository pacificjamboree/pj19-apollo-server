const TABLE = 'adventure_period';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.enu('type', ['primary', 'child']);
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('type');
  });
