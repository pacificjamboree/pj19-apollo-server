const env = process.env.NODE_ENV || 'development';
const knexStringcase = require('knex-stringcase');
module.exports = require('knex')(knexStringcase(require('./knexfile')[env]));
