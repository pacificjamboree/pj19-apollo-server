exports.up = (knex, Promise) => {
  return knex.schema.alterTable('oos', t => {
    t.unique('oosNumber');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.alterTable('oos', t => {
    t.dropUnique('oosNumber');
  });
};
