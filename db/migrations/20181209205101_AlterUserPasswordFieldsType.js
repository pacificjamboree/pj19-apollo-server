const TABLE = 'user';

exports.up = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.text('password_hash').alter();
    t.text('password_reset_token').alter();
  });

exports.down = knex => {};
