const casual = require('casual');
const table = 'oos';

const data = [];
for (let i = 0; i < 10; i++) {
  const prerecruited = casual.boolean;
  const prerecruited_by = prerecruited ? casual.full_name : null;
  data.push({
    oos_number: `OOS${i + 1}`,
    first_name: casual.first_name,
    last_name: casual.last_name,
    birthdate: casual.date(),
    is_youth: false,
    email: casual.email,
    phone1: casual.phone,
    phone2: casual.phone,
    prerecruited,
    prerecruited_by
  });
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex(table)
    .del()
    .then(function() {
      // Inserts seed entries
      return knex(table).insert(data);
    });
};
