const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV]);

const resolvers = {
  Query: {
    OOS: () =>
      knex
        .from('oos')
        .select(['oos_number', 'first_name', 'last_name', 'preferred_name'])
  }
};

module.exports = resolvers;
