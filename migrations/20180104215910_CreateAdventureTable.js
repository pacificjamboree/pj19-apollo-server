exports.up = (knex, Promise) => {
  return knex.schema.createTable('adventure', t => {
    t
      .increments('id')
      .unsigned()
      .primary();
    t.timestamps();

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
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('adventure');
};
