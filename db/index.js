const { NODE_ENV } = process.env || 'development';
const knexStringcase = require('knex-stringcase');
module.exports = require('knex')(
  knexStringcase(require('./knexfile')[NODE_ENV])
);
