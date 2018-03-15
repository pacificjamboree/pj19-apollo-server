const { hashSync } = require('bcrypt');

exports.seed = async (knex, Promise) => {
  const oos = await knex('oos').select('*');
  const oosUsers = oos.map(o => ({
    oos_id: o.id,
    username: o.email,
    password_hash: hashSync('passw0rd', 2),
    workflow_state: 'active',
  }));
  const patrolScouters = await knex('patrol_scouter').select('*');
  const patrolScouterUsers = patrolScouters.map(p => ({
    patrol_scouter_id: p.id,
    username: p.email,
    password_hash: hashSync('passw0rd', 2),
    workflow_state: 'active',
  }));
  const users = oosUsers.concat(patrolScouterUsers);
  const promises = users.map(u => knex('user').insert(u));
  return Promise.all(promises);
};
