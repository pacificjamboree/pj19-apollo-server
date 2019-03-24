const TABLE = 'patrol_scouter';

exports.up = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('first_name');
    t.dropColumn('last_name');
    t.dropColumn('phone');
  });

exports.down = knex =>
  knex.schema.table(TABLE, t => {
    t.string('first_name').notNullable();
    t.string('last_name').notNullable();
    t.text('phone_number');
  });
