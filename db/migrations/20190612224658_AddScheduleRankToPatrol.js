const TABLE = 'patrol';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.integer('schedule_rank');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('schedule_rank');
  });
