const TABLE = 'oos';
exports.up = (knex, Promise) => {
  return knex.schema.alterTable(TABLE, t => {
    t.unique('oos_number');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.alterTable(TABLE, t => {
    t.dropUnique('oos_number');
  });
};
