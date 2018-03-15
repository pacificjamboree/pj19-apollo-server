const TABLE = 'adventure_managers';

exports.up = (knex, Promise) =>
  knex.schema
    .createTable(TABLE, t => {
      t
        .uuid('id')
        .primary()
        .default(knex.raw('gen_random_uuid()'));

      t
        .uuid('oos_id')
        .notNullable()
        .references('oos.id');
      t
        .uuid('adventure_id')
        .notNullable()
        .references('adventure.id');

      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .raw(
      `CREATE TRIGGER update_${TABLE}_updated_at BEFORE UPDATE ON ${TABLE} FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`
    );

exports.down = (knex, Promise) => knex.schema.dropTable(TABLE);
