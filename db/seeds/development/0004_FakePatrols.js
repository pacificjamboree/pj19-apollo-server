const casual = require('casual');
const dateFormat = require('date-fns/format');
const TABLE = 'patrol';
const NUM_PATROLS = 240;
const data = [];

const getOrdinal = n => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

casual.define(
  'date_between',
  (start = 1527811200000, end = 1561939200000, format = 'YYYY-MM-DD') =>
    dateFormat(casual.integer(start, end), format)
);

for (let i = 0; i < NUM_PATROLS; i++) {
  data.push({
    patrol_number: `PATROL_${(i + 1).toString().padStart('4', '0')}`,
    name: `${getOrdinal(casual.integer(1, 100))} ${casual.city}`,
    number_of_scouts: casual.integer(6, 8),
    number_of_scouters: 2,
    final_payment_date: casual.coin_flip ? casual.date_between : null,
    workflow_state: 'active',
  });
}
exports.seed = async (knex, Promise) => {
  // delete all patrol scouters
  await knex('patrol_scouter').del();
  await knex(TABLE).del();
  await knex(TABLE).insert(data);
};
