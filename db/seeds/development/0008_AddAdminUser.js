const { hashSync } = require('bcrypt');

exports.seed = async (knex, Promise) =>
  knex('user').insert({
    username: 'admin',
    password_hash: hashSync('passw0rd', 2),
    workflow_state: 'active',
    admin: true,
  });
