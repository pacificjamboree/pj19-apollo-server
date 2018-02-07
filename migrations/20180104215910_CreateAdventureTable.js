const TABLE = 'adventure';
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable(TABLE, t => {
      t
        .uuid('id')
        .primary()
        .default(knex.raw('gen_random_uuid()'));

      t.string('adventure_code');
      t.string('name').notNullable();
      t.string('theme_name').notNullable();
      t.string('description');
      t.enu('location', ['onsite', 'offsite']);
      t.integer('capacity_per_period').notNullable();
      t.integer('periods_offered').notNullable();
      t.integer('periods_required').notNullable();
      t
        .boolean('premium_adventure')
        .defaultTo(false)
        .notNullable();
      t
        .decimal('fee')
        .notNullable()
        .defaultTo(0.0);
      t
        .boolean('hidden')
        .notNullable()
        .defaultTo(false);

      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .raw(
      `CREATE TRIGGER update_${TABLE}_updated_at BEFORE UPDATE ON ${TABLE} FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`
    );
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TABLE);
};
