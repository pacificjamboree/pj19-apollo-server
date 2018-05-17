const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const compression = require('compression');
const jwtMiddleware = require('express-jwt');
const schema = require('./app/graphql/schema');
const PORT = process.env.PORT || 3000;

const { login } = require('./app/routes');

const app = express();
app.use(compression());

app.post('/login', bodyParser.urlencoded({ extended: false }), login);
app.post(
  '/graphql',
  bodyParser.json(),
  jwtMiddleware({ credentialsRequired: false, secret: process.env.JWT_SECRET }),
  graphqlExpress({ schema })
);
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}.`);
});
