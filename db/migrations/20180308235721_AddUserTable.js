const TABLE = 'user';

exports.up = (knex, Promise) =>
  knex.schema.createTable(TABLE, t => {
    t
      .uuid('id')
      .primary()
      .default(knex.raw('gen_random_uuid()'));
    t.uuid('oos_id').references('oos.id');
    t.uuid('patrol_scouter_id').references('patrol_scouter.id');
    t.string('username').notNullable();
    t.string('password_hash').notNullable();
    t.string('password_reset_token');

    t
      .enu('workflow_state', ['defined', 'active', 'deleted'])
      .defaultTo('defined');

    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

exports.down = (knex, Promise) => knex.schema.dropTable(TABLE);
