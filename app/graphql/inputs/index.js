const { readdirSync } = require('fs');
const { resolve } = require('path');

const inputs = [];

readdirSync(__dirname)
  .filter(f => f !== 'index.js')
  .forEach(f => {
    const str = require(resolve(__dirname, f));
    inputs.push(str);
  });
module.exports = inputs.join('\n');
