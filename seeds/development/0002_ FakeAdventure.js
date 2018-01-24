const table = 'adventure';

const data = [
  {
    adventureCode: 'ADV001',
    name: 'SUP',
    themeName: 'SUP',
    description: 'SUP',
    location: 'onsite',
    capacityPerPeriod: 50,
    periodsOffered: 11,
    periodsRequired: 1,
    premiumAdventure: false,
    fee: 0.0,
    hidden: false,
    workflowState: 'active'
  },
  {
    adventureCode: 'ADV002',
    name: 'Kayaking',
    themeName: 'Kayaking',
    description: 'Kayaking',
    location: 'offsite',
    capacityPerPeriod: 36,
    periodsOffered: 11,
    periodsRequired: 1,
    premiumAdventure: true,
    fee: 0.0,
    hidden: false,
    workflowState: 'active'
  },
  {
    adventureCode: 'ADV003',
    name: 'SCUBA',
    themeName: 'SCUBA',
    description: 'SCUBA',
    location: 'offsite',
    capacityPerPeriod: 50,
    periodsOffered: 10,
    periodsRequired: 1,
    premiumAdventure: false,
    fee: 50.0,
    hidden: false,
    workflowState: 'active'
  },
  {
    adventureCode: 'ADV004',
    name: 'Townsite',
    themeName: 'Townsite',
    description: 'Townsite',
    location: 'onsite',
    capacityPerPeriod: 200,
    periodsOffered: 11,
    periodsRequired: 1,
    premiumAdventure: false,
    fee: 0.0,
    hidden: false,
    workflowState: 'active'
  },
  {
    adventureCode: 'ADV005',
    name: 'Mtn. Biking',
    themeName: 'Mtn. Biking',
    description: 'Mtn. Biking',
    location: 'onsite',
    capacityPerPeriod: 50,
    periodsOffered: 11,
    periodsRequired: 1,
    premiumAdventure: true,
    fee: 0.0,
    hidden: false,
    workflowState: 'active'
  }
];

exports.seed = function(knex, Promise) {
  return knex(table)
    .del()
    .then(() => knex(table).insert(data));
};
