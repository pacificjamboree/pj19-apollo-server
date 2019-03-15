exports.up = knex =>
  knex.schema.alterTable('adventure', t => {
    t.integer('fee').alter();
  });

exports.down = knex => {};
