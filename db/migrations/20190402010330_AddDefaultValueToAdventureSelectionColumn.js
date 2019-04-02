const TABLE = 'patrol_adventure_selection';

exports.up = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.jsonb('selection_order')
      .defaultTo('[]')
      .notNullable()
      .alter();
  });

exports.down = knex =>
  knex.raw(
    `alter table ${TABLE} alter column selection_order drop default; alter table ${TABLE} alter column selection_order drop not null;`
  );
