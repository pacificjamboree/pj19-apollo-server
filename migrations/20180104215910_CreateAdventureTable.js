const table = 'adventure';
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable(table, t => {
      t
        .uuid('id')
        .primary()
        .default(knex.raw('gen_random_uuid()'));

      t.string('adventureCode');
      t.string('name').notNullable();
      t.string('themeName').notNullable();
      t.string('description');
      t.enu('location', ['onsite', 'offsite']);
      t.integer('capacityPerPeriod').notNullable();
      t.integer('periodsOffered').notNullable();
      t.integer('periodsRequired').notNullable();
      t
        .boolean('premiumAdventure')
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

      t.timestamp('createdAt').defaultTo(knex.fn.now());
      t.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
    .raw(
      `CREATE TRIGGER update_${table}_updated_at BEFORE UPDATE ON ${table} FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`
    );
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(table);
};
