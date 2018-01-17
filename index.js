const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { Engine } = require('apollo-engine');
const compression = require('compression');
const schema = require('./graphql/schema');
const PORT = process.env.PORT || 3000;
const { APOLLO_ENGINE_API_KEY } = process.env;
const engine = new Engine({
  engineConfig: {
    apiKey: APOLLO_ENGINE_API_KEY
  },
  graphqlPort: PORT
});
engine.start();

const app = express();
app.use(engine.expressMiddleware());
app.use(compression());
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({ schema, tracing: true })
);
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}.`);
});
