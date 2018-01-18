const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV]);
const { GraphQLDate, GraphQLDateTime } = require('graphql-iso-date');

const resolvers = {
  GraphQLDate,
  GraphQLDateTime,
  Query: {
    // offers of service
    allOffersOfService: () => knex.from('oos').select('*'),
    offerOfService: (_, { oos_number }) => {
      return knex
        .from('oos')
        .select('*')
        .where({ oos_number })
        .first();
    },

    // adventures
    allAdventures: () => knex.from('adventure').select('*'),
    adventure: (_, { adventure_code }) =>
      knex
        .from('adventure')
        .select('*')
        .where({ adventure_code })
        .first()
  }
};

module.exports = resolvers;
