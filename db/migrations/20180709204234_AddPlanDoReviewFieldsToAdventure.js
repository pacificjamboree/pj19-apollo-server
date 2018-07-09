const TABLE = 'adventure';
exports.up = knex =>
  knex.schema.table(TABLE, t => {
    t.jsonb('pdr_plan');
    t.jsonb('pdr_do');
    t.jsonb('pdr_review');
    t.jsonb('pdr_safety_tips');
  });

exports.down = knex =>
  knex.schema.alterTable(TABLE, t => {
    t.dropColumn('pdr_plan');
    t.dropColumn('pdr_do');
    t.dropColumn('pdr_review');
    t.dropColumn('pdr_safety_tips');
  });
