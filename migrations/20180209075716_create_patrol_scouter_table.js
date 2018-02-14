const TABLE = 'patrol_scouter';

exports.up = (knex, Promise) =>
  knex.schema
    .createTable(TABLE, t => {
      t
        .uuid('id')
        .primary()
        .default(knex.raw('gen_random_uuid()'));

      t
        .uuid('patrol_id')
        .references('patrol.id')
        .notNullable();

      t.string('first_name').notNullable();
      t.string('last_name').notNullable();
      t.string('email').notNullable();

      t
        .enu('workflow_state', ['defined', 'active', 'deleted'])
        .defaultTo('defined');

      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .raw(
      `CREATE TRIGGER update_${TABLE}_updated_at BEFORE UPDATE ON ${TABLE} FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`
    );

exports.down = (knex, Promise) => knex.schema.dropTable(TABLE);
