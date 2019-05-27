const TABLE = 'adventure_period';

exports.up = knex =>
  knex.schema
    .createTable(TABLE, t => {
      t.uuid('id')
        .primary()
        .default(knex.raw('gen_random_uuid()'));
      t.uuid('adventure_id').references('adventure.id');
      t.jsonb('assign_with')
        .defaultTo('[]')
        .comment(
          'Assign the patrol to these periods when addind to this one (e.g. for fencing and archery)'
        );
      t.jsonb('child_periods')
        .defaultTo('[]')
        .comment(
          'Additional periods to assign with this period for full-day and overnight adventures'
        );
      t.timestamp('start_at').notNullable();
      t.timestamp('end_at').notNullable();
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .raw(
      `CREATE TRIGGER update_${TABLE}_updated_at BEFORE UPDATE ON ${TABLE} FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`
    );

exports.down = knex => knex.schema.droptable(TABLE);
