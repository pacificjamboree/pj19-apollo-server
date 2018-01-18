const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV]);

const resolvers = {
  Query: {
    allOffersOfService: () => knex.from('oos').select('*'),
    offerOfService: (_, { oos_number }) => {
      return knex
        .from('oos')
        .select('*')
        .where({ oos_number: oos_number })
        .first();
    }
  }
};

module.exports = resolvers;
