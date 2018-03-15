const TABLE = 'patrol';
exports.up = (knex, Promise) =>
  knex.schema
    .createTable(TABLE, t => {
      t
        .uuid('id')
        .primary()
        .default(knex.raw('gen_random_uuid()'));

      t
        .string('patrol_number')
        .notNullable()
        .unique();
      t.string('name').notNullable();

      t
        .integer('number_of_scouts')
        .notNullable()
        .defaultTo(0);
      t
        .integer('number_of_scouters')
        .notNullable()
        .defaultTo(0);

      t.date('final_payment_received');

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
