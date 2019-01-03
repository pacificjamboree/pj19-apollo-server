const TABLE = 'adventure';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.text('oos_description');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('oos_description');
  });
