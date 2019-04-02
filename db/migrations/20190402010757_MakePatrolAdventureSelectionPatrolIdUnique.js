const TABLE = 'patrol_adventure_selection';

exports.up = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.uuid('patrol_id')
      .unique()
      .alter();
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropUnique('patrol_id');
  });
