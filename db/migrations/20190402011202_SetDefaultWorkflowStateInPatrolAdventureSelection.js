const TABLE = 'patrol_adventure_selection';

exports.up = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('workflow_state');
  });

exports.down = knex =>
  knex.schema.table(TABLE, t => {
    t.enu('workflow_state', ['draft', 'saved', 'locked']);
  });
