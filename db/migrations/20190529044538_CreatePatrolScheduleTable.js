const TABLE = 'patrol_schedule';

exports.up = knex =>
  knex.schema
    .createTable(TABLE, t => {
      t.uuid('id')
        .primary()
        .default(knex.raw('gen_random_uuid()'));
      t.uuid('patrol_id').references('patrol.id');
      t.uuid('adventure_period_id').references('adventure_period.id');
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .raw(
      `CREATE TRIGGER update_${TABLE}_updated_at BEFORE UPDATE ON ${TABLE} FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`
    );

exports.down = knex => knex.schema.droptable(TABLE);
