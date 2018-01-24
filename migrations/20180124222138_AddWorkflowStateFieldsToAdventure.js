const TABLE = 'adventure';
exports.up = (knex, Promise) => {
  return knex.transaction(txn => {
    return (
      knex.schema
        // defined = after OOS is imported into DB but has not been activated (e.g. through a bulk-import)
        // active = OOS is active and can be assigned to program
        // deleted = OOS has been deleted
        .table(TABLE, t =>
          t
            .enu('workflowState', ['defined', 'active', 'deleted'])
            .defaultTo('defined')
        )
        .then(() => {
          return knex(TABLE).update({ workflowState: 'active' });
        })
        .then(txn.commit)
        .catch(txn.rollback)
    );
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.alterTable(TABLE, t => {
    t.dropColumn('workflowState');
  });
};
