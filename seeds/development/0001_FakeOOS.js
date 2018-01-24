const casual = require('casual');
const table = 'oos';

const data = [];
for (let i = 0; i < 30; i++) {
  const prerecruited = casual.boolean;
  const prerecruitedBy = prerecruited ? casual.full_name : null;
  data.push({
    oosNumber: `OOS${i + 1}`,
    firstName: casual.first_name,
    lastName: casual.last_name,
    birthdate: casual.date(),
    email: casual.email,
    phone1: casual.phone,
    phone2: casual.phone,
    prerecruited,
    prerecruitedBy
  });
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entreies
  return knex(table)
    .del()
    .then(function() {
      // Inserts seed entries
      return knex(table).insert(data);
    });
};
