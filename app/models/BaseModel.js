const { Model } = require('objection');
const db = require('../../db');
Model.knex(db);

module.exports = Model;
