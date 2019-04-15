const TABLE = 'adventure';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.boolean('recruitable').defaultTo(true);
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('recruitable');
  });
