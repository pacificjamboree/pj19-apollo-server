const TABLE = 'patrol_scouter';

exports.up = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('patrol_id');
  });

exports.down = knex => {};
