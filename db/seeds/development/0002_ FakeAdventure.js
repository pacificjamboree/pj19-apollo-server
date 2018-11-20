const table = 'adventure';
const randomInt = () => Math.floor(Math.random() * (50 - 5) + 5);

const data = [
  {
    adventure_code: 'ADV_0001',
    name: 'SUP',
    theme_name: 'SUP',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus convallis felis consectetur quam condimentum ornare. Sed suscipit, turpis eu consectetur placerat, massa velit fringilla massa, a sagittis est velit non erat. Nunc rhoncus turpis ut magna faucibus malesuada. Fusce et eros vitae neque dignissim venenatis.',
    location: 'onsite',
    capacity_per_period: 50,
    periods_offered: 11,
    periods_required: 1,
    premium_adventure: false,
    fee: 0.0,
    hidden: false,
    workflow_state: 'active',
    oos_required: randomInt(),
  },
  {
    adventure_code: 'ADV_0002',
    name: 'Kayaking',
    theme_name: 'Kayaking',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus convallis felis consectetur quam condimentum ornare. Sed suscipit, turpis eu consectetur placerat, massa velit fringilla massa, a sagittis est velit non erat. Nunc rhoncus turpis ut magna faucibus malesuada. Fusce et eros vitae neque dignissim venenatis.',
    location: 'offsite',
    capacity_per_period: 36,
    periods_offered: 11,
    periods_required: 1,
    premium_adventure: true,
    fee: 0.0,
    hidden: false,
    workflow_state: 'active',
    oos_required: randomInt(),
  },
  {
    adventure_code: 'ADV_0003',
    name: 'SCUBA',
    theme_name: 'SCUBA',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus convallis felis consectetur quam condimentum ornare. Sed suscipit, turpis eu consectetur placerat, massa velit fringilla massa, a sagittis est velit non erat. Nunc rhoncus turpis ut magna faucibus malesuada. Fusce et eros vitae neque dignissim venenatis.',
    location: 'offsite',
    capacity_per_period: 50,
    periods_offered: 10,
    periods_required: 1,
    premium_adventure: false,
    fee: 50.0,
    hidden: false,
    workflow_state: 'active',
    oos_required: randomInt(),
  },
  {
    adventure_code: 'ADV_0004',
    name: 'Townsite',
    theme_name: 'Townsite',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus convallis felis consectetur quam condimentum ornare. Sed suscipit, turpis eu consectetur placerat, massa velit fringilla massa, a sagittis est velit non erat. Nunc rhoncus turpis ut magna faucibus malesuada. Fusce et eros vitae neque dignissim venenatis.',
    location: 'onsite',
    capacity_per_period: 200,
    periods_offered: 11,
    periods_required: 1,
    premium_adventure: false,
    fee: 0.0,
    hidden: false,
    workflow_state: 'active',
    oos_required: randomInt(),
  },
  {
    adventure_code: 'ADV_0005',
    name: 'Mtn. Biking',
    theme_name: 'Mtn. Biking',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus convallis felis consectetur quam condimentum ornare. Sed suscipit, turpis eu consectetur placerat, massa velit fringilla massa, a sagittis est velit non erat. Nunc rhoncus turpis ut magna faucibus malesuada. Fusce et eros vitae neque dignissim venenatis.',
    location: 'onsite',
    capacity_per_period: 50,
    periods_offered: 11,
    periods_required: 1,
    premium_adventure: true,
    fee: 0.0,
    hidden: false,
    workflow_state: 'active',
    oos_required: randomInt(),
  },
];

exports.seed = function(knex, Promise) {
  return knex(table)
    .del()
    .then(() => knex(table).insert(data));
};
