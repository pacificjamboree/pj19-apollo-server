exports.up = knex =>
  knex.schema.alterTable('content_revision', t => {
    t.text('body').alter();
  });

exports.down = knex => {};
