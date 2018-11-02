const TABLE = 'oos';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.string('import_id');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('import_id');
  });
