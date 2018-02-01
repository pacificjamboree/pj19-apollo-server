const { importSchema } = require('graphql-import');
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

// path to schema is relative to the project root  ¯\_(ツ)_/¯
const typeDefs = importSchema('graphql/Schema.graphql');

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
