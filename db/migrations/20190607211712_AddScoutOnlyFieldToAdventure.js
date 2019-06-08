const TABLE = 'adventure';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.boolean('scout_only')
      .notNullable()
      .defaultTo(false);
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('scout_only');
  });
