const TABLE = 'oos';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.string('parent_email');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('parent_email');
  });
