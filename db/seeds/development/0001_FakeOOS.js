const casual = require('casual');
const TABLE = 'oos';

const data = [];
for (let i = 0; i < 100; i++) {
  const prerecruited = casual.boolean;
  const prerecruited_by = prerecruited ? casual.full_name : null;
  data.push({
    oos_number: `OOS_${(i + 1).toString().padStart('4', '0')}`,
    first_name: casual.first_name,
    last_name: casual.last_name,
    birthdate: casual.date(),
    email: casual.email,
    phone1: casual.phone,
    phone2: casual.phone,
    prerecruited,
    prerecruited_by,
    workflow_state: 'active',
  });
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entreies
  return knex(TABLE)
    .del()
    .then(function() {
      // Inserts seed entries
      return knex(TABLE).insert(data);
    });
};
