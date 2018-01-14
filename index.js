const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV]);

const PORT = process.env.PORT || 3000;

// The GraphQL schema in string form
const typeDefs = `
  type Query { OOS: [OOS] }
  type OOS { 
    oos_number: String!,
    first_name: String!,
    last_name: String!,
    preferred_name: String!
   }
`;

// The resolvers
const resolvers = {
  Query: {
    OOS: () =>
      knex
        .from('oos')
        .select(['oos_number', 'first_name', 'last_name', 'preferred_name'])
  }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}.`);
});
