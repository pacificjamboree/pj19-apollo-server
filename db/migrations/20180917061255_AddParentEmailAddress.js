const TABLE = 'oos';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.string('parentEmail');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('parentEmail');
  });
