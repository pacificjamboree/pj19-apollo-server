const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const compression = require('compression');
const jwtMiddleware = require('express-jwt');
const schema = require('./app/graphql/schema');
const PORT = process.env.PORT || 3000;
const { User } = require('./app/models');
const { login } = require('./app/routes');

const app = express();
app.use(compression());

app.post('/login', bodyParser.urlencoded({ extended: false }), login);
app.post(
  '/graphql',
  bodyParser.json(),
  jwtMiddleware({
    credentialsRequired: false,
    secret: process.env.JWT_SECRET,
    requestProperty: 'auth',
  }),
  async (req, res, next) => {
    if (req.auth === undefined) next();
    const user = await User.query()
      .where({ id: req.auth.sub.id })
      .select([
        'id',
        'oosId',
        'patrolScouterId',
        'username',
        'workflowState',
        'admin',
      ])
      .first();
    const roles = await user.calculateRoles();
    req.user = {
      ...user,
      roles,
    };
    next();
  },
  graphqlExpress(req => {
    return {
      schema,
      context: {
        auth: req.auth,
        user: req.user,
      },
    };
  })
);
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}.`);
});
