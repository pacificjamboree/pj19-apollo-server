const TABLE = 'adventure';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.integer('adult_oos_required')
      .notNullable()
      .defaultTo(0);
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('adult_oos_required');
  });
