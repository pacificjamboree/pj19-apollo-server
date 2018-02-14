const table = 'adventure';

const data = [
  {
    adventure_code: 'ADV_0001',
    name: 'SUP',
    theme_name: 'SUP',
    description: 'SUP',
    location: 'onsite',
    capacity_per_period: 50,
    periods_offered: 11,
    periods_required: 1,
    premium_adventure: false,
    fee: 0.0,
    hidden: false,
    workflow_state: 'active',
  },
  {
    adventure_code: 'ADV_0002',
    name: 'Kayaking',
    theme_name: 'Kayaking',
    description: 'Kayaking',
    location: 'offsite',
    capacity_per_period: 36,
    periods_offered: 11,
    periods_required: 1,
    premium_adventure: true,
    fee: 0.0,
    hidden: false,
    workflow_state: 'active',
  },
  {
    adventure_code: 'ADV_0003',
    name: 'SCUBA',
    theme_name: 'SCUBA',
    description: 'SCUBA',
    location: 'offsite',
    capacity_per_period: 50,
    periods_offered: 10,
    periods_required: 1,
    premium_adventure: false,
    fee: 50.0,
    hidden: false,
    workflow_state: 'active',
  },
  {
    adventure_code: 'ADV_0004',
    name: 'Townsite',
    theme_name: 'Townsite',
    description: 'Townsite',
    location: 'onsite',
    capacity_per_period: 200,
    periods_offered: 11,
    periods_required: 1,
    premium_adventure: false,
    fee: 0.0,
    hidden: false,
    workflow_state: 'active',
  },
  {
    adventure_code: 'ADV_0005',
    name: 'Mtn. Biking',
    theme_name: 'Mtn. Biking',
    description: 'Mtn. Biking',
    location: 'onsite',
    capacity_per_period: 50,
    periods_offered: 11,
    periods_required: 1,
    premium_adventure: true,
    fee: 0.0,
    hidden: false,
    workflow_state: 'active',
  },
];

exports.seed = function(knex, Promise) {
  return knex(table)
    .del()
    .then(() => knex(table).insert(data));
};
