const TABLE = 'patrol';

exports.up = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.renameColumn('final_payment_received', 'final_payment_date');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.renameColumn('final_payment_date', 'final_payment_received');
  });
