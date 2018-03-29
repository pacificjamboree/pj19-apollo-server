exports.seed = async (knex, Promise) => {
  try {
    const IGNORE_TABLES = ['knex_migrations', 'knex_migrations_lock'];
    let tables = await knex.raw(`
    SELECT table_schema,table_name FROM information_schema.tables 
    WHERE table_schema = 'public' ORDER BY table_schema,table_name;
    `);
    tables = tables.rows
      .map(t => t.table_name)
      .filter(t => !IGNORE_TABLES.includes(t));
    const TRUNCATE_SQL = `TRUNCATE TABLE "${tables.join(
      '","'
    )}" RESTART IDENTITY`;
    await knex.raw(TRUNCATE_SQL);
  } catch (e) {
    throw e;
  }
};
