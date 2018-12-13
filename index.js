const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const compression = require('compression');
const jwtMiddleware = require('express-jwt');
const cors = require('cors');
require('dotenv').config();
const schema = require('./app/graphql/schema');
const PORT = process.env.PORT || 3000;
const { User } = require('./app/models');
const { login } = require('./app/routes');

const addUserMiddleware = async (req, res, next) => {
  try {
    if (req.auth === undefined) return next();
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
    if (!user) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    const roles = await user.calculateRoles();
    req.user = {
      ...user,
      roles,
    };
    next();
  } catch (e) {
    console.log('caught?');
    throw e;
  }
};

const app = express();
const path = '/graphql';
const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    auth: req.auth,
    user: req.user,
  }),
  introspection: true,
  playground: true,
});

app.use(compression());
app.use(cors());
app.post('/login', bodyParser.urlencoded({ extended: false }), login);

app.use(
  path,
  bodyParser.json(),
  jwtMiddleware({
    credentialsRequired: false,
    secret: process.env.JWT_SECRET,
    requestProperty: 'auth',
  }),
  addUserMiddleware
);
server.applyMiddleware({ app, path });

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}.`);
});
