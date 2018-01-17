const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV]);

const resolvers = {
  Query: {
    allOffersOfService: () =>
      knex
        .from('oos')
        .select(['oos_number', 'first_name', 'last_name', 'preferred_name']),
    offerOfService: (_, { oos_number }) => {
      return knex
        .from('oos')
        .select(['oos_number', 'first_name', 'last_name', 'preferred_name'])
        .where({ oos_number: oos_number })
        .first();
    }
  }
};

module.exports = resolvers;
