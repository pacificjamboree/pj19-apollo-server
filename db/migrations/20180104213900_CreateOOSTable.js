const TABLE = 'oos';
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable(TABLE, t => {
      t
        .uuid('id')
        .primary()
        .default(knex.raw('gen_random_uuid()'));

      t.string('oos_number').notNullable();
      t.string('first_name').notNullable();
      t.string('last_name').notNullable();
      t.string('preferred_name');
      t.date('birthdate');

      t.string('email');
      t.string('phone1');
      t.string('phone2');

      t
        .boolean('prerecruited')
        .notNullable()
        .defaultTo(false);
      t.string('prerecruited_by');
      t.string('additional_information');
      t.string('previous_experience');
      t.string('special_skills');

      t.string('registration_status');
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
