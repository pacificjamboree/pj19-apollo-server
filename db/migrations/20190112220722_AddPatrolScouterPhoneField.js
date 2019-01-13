const TABLE = 'patrol_scouter';
const COLUMN = 'phone';

exports.up = knex => {
  knex.schema.table(TABLE, t => {
    t.text(COLUMN);
  });
};

exports.down = knex => {
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn(COLUMN);
  });
};
