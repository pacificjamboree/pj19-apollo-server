exports.up = (knex, Promise) => {
  return knex.schema.alterTable('oos', t => {
    t.unique('oos_number');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.alterTable('oos', t => {
    t.dropUnique('oos_number');
  });
};
