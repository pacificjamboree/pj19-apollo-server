exports.up = (knex, Promise) => {
  return knex.schema.createTable('oos', t => {
    t
      .uuid('id')
      .primary()
      .default(knex.raw('gen_random_uuid()'));
    t.timestamps();

    t.string('oos_number').notNullable();
    t
      .boolean('assigned')
      .notNullable()
      .defaultTo(false);

    t.string('first_name').notNullable();
    t.string('last_name').notNullable();
    t.string('preferred_name');
    t.date('birthdate');
    t.boolean('is_youth');

    t.string('email');
    t.string('phone1');
    t.string('phone2');

    t.boolean('prerecruited').defaultTo(false);
    t.string('prerecruited_by');
    t.string('additional_information');
    t.string('previous_experience');
    t.string('special_skills');

    t.string('registration_status');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('oos');
};
