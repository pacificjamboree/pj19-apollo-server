const TABLE = 'oos';

exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.timestamp('welcome_email_sent_at');
    t.timestamp('assignment_email_sent_at');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('welcome_email_sent_at');
    t.dropColumn('assignment_email_sent_at');
  });
