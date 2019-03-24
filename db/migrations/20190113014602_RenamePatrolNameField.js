const TABLE = 'patrol';

exports.up = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.renameColumn('name', 'patrol_name');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.renameColumn('patrol_name', 'name');
  });
