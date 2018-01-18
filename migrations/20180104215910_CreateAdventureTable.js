const table = 'adventure';
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable(table, t => {
      t
        .uuid('id')
        .primary()
        .default(knex)
        .default(knex.raw('gen_random_uuid()'));
      t.timestamps(true, true);

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
    })
    .raw(
      `CREATE TRIGGER update_${table}_updated_at BEFORE UPDATE ON ${table} FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`
    );
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(table);
};
