const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const compression = require('compression');
const schema = require('./graphql/schema');
const PORT = process.env.PORT || 3000;

const app = express();
// app.use(engine.expressMiddleware());
app.use(compression());
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}.`);
});
