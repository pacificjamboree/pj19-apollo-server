const formatAlterTableEnumSql = (tableName, columnName, enums) => {
  const constraintName = `${tableName}_${columnName}_check`;
  return [
    `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${constraintName};`,
    `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} CHECK (${columnName} = ANY (ARRAY['${enums.join(
      "'::text, '"
    )}'::text]));`,
  ].join('\n');
};

const TABLE = 'patrol_adventure_selection';

exports.up = async function up(knex) {
  await knex.raw(
    formatAlterTableEnumSql(TABLE, 'workflow_state', [
      'defined',
      'draft',
      'saved',
      'locked',
      'deleted',
    ])
  );
};

exports.down = async function down(knex) {
  await knex.raw(
    formatAlterTableEnumSql(TABLE, 'workflow_state', [
      'defined',
      'draft',
      'saved',
      'locked',
    ])
  );
};
