const fs = require('fs');
const mutations = {};
fs
  .readdirSync(__dirname)
  .filter(f => f !== 'index.js')
  .map(f => f.replace('.js', ''))
  .forEach(f => {
    mutations[f] = require(`./${f}`);
  });

module.exports = mutations;
