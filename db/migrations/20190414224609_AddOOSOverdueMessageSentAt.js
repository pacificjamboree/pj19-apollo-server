const TABLE = 'oos';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.timestamp('overdue_email_sent_at');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('overdue_email_sent_at');
  });
