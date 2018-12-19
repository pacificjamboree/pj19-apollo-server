const sql = `
ALTER TABLE "public"."adventure" 
ADD CONSTRAINT "adventure_code_check" 
CHECK (adventure_code <> '') 
NOT DEFERRABLE INITIALLY IMMEDIATE;
`;

exports.up = knex => {
  return knex.schema.raw(sql);
};

exports.down = knex => {
  return knex.schema.raw('DROP FUNCTION update_updated_at_column()');
};
