const casual = require('casual');
const TABLE = 'patrol_scouter';

const scouter = patrol_id => ({
  patrol_id,
  first_name: casual.first_name,
  last_name: casual.last_name,
  email: casual.email,
  workflow_state: 'active',
});

exports.seed = async (knex, Promise) => {
  await knex(TABLE).del();
  const patrols = await knex('patrol').select('id');
  const data = [];
  patrols.forEach(p => {
    data.push(scouter(p.id));
    data.push(scouter(p.id));
  });
  await knex(TABLE).insert(data);
};
