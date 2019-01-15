const TABLE = 'patrol';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.uuid('patrol_scouter_id').references('patrol_scouter.id');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('patrol_scouter_id');
  });
