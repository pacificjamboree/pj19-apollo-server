const TABLE = 'user';
exports.up = (knex, Promise) =>
  knex.schema.table(TABLE, t => {
    t
      .boolean('admin')
      .defaultTo(false)
      .notNullable();
  });

exports.down = (knex, Promise) =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('admin');
  });
