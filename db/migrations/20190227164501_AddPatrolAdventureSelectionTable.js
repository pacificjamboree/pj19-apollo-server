const TABLE = 'patrol_adventure_selection';
exports.up = knex =>
  knex.schema.createTable(TABLE, t => {
    t.uuid('id')
      .primary()
      .default(knex.raw('gen_random_uuid()'));
    t.uuid('patrol_id')
      .references('patrol.id')
      .notNullable();
    t.boolean('want_scuba')
      .defaultTo(false)
      .notNullable();
    t.boolean('want_extra_free_period')
      .defaultTo(false)
      .notNullable();
    t.jsonb('selection_order');
    t.enu('workflow_state', ['draft', 'saved', 'locked']);
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

exports.down = knex => knex.schema.dropTable(TABLE);
