const TABLE = 'patrol_scouter';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.text('import_id');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('import_id');
  });
