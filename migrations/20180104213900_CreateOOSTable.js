const table = 'oos';
exports.up = (knex, Promise) => {
  return knex.schema
    .createTable(table, t => {
      t
        .uuid('id')
        .primary()
        .default(knex.raw('gen_random_uuid()'));

      t.string('oosNumber').notNullable();
      t.string('firstName').notNullable();
      t.string('lastName').notNullable();
      t.string('preferredName');
      t.date('birthdate');

      t.string('email');
      t.string('phone1');
      t.string('phone2');

      t
        .boolean('prerecruited')
        .notNullable()
        .defaultTo(false);
      t.string('prerecruitedBy');
      t.string('additionalInformation');
      t.string('previousExperience');
      t.string('specialSkills');

      t.string('registrationStatus');
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
