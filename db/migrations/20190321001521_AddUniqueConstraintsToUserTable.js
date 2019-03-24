const TABLE = 'user';

exports.up = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.unique('patrol_scouter_id');
    t.unique('oos_id');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropUnique('patrol_scouter_id');
    t.dropUnique('oos_id');
  });
