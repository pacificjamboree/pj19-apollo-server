const TABLE = 'adventure';
exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.integer('oos_required')
      .notNullable()
      .defaultTo(0);
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('oos_required');
  });
