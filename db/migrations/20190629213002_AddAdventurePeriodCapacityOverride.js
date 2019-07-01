const TABLE = 'adventure_period';
const COLUMN = 'capacity_override';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.integer(COLUMN);
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn(COLUMN);
  });
