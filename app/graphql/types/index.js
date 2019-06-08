const fs = require('fs');
const types = {};
fs.readdirSync(__dirname)
  .filter(f => f !== 'index.js')
  .map(f => f.replace('.js', ''))
  .forEach(f => {
    types[f] = require(`./${f}`);
  });

module.exports = types;
